import { FilesetResolver, ObjectDetector } from '@mediapipe/tasks-vision';
import { useMonitoring } from '@monkvision/monitoring';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { MAX_DETECTION_RESULTS, MIN_DETECTION_SCORE, VEHICLE_CATEGORY_NAMES } from '../constants';
import { DetectorDelegate, DetectorStatus } from '../types';

/**
 * Params accepted by the useObjectDetector hook.
 */
export interface UseObjectDetectorParams {
  /**
   * The URL of the `.tflite` model to load.
   */
  modelAssetPath: string;
  /**
   * The base URL of the MediaPipe vision WASM runtime.
   */
  wasmBasePath: string;
  /**
   * Which backend the model should run on.
   */
  delegate: DetectorDelegate;
}

/**
 * The handle returned by the useObjectDetector hook.
 */
export interface ObjectDetectorHandle {
  /**
   * Ref to the object detector. It is a ref rather than a state value so that the inference loop can never read a
   * stale detector, and so that creating it does not trigger a render.
   */
  detectorRef: MutableRefObject<ObjectDetector | null>;
  /**
   * The current status of the detector. The inference loop is gated on this being `DetectorStatus.READY`.
   */
  status: DetectorStatus;
  /**
   * The delegate the detector actually ended up running on, or null while it is still loading.
   */
  activeDelegate: DetectorDelegate.CPU | DetectorDelegate.GPU | null;
  /**
   * Reports that an inference call failed. If the detector is running on the GPU, this transparently recreates it on
   * the CPU. Calling it more than once never triggers more than a single fallback.
   */
  reportInferenceFailure: (error: unknown) => void;
}

/**
 * Resolves the delegate to actually use.
 *
 * iOS is defaulted to the CPU on purpose. Its WebGL implementation is the single flakiest component of this stack
 * (contexts are capped per tab and aggressively reclaimed when the tab backgrounds), and EfficientDet-Lite0 at a
 * 320x320 input runs comfortably inside the per-tick budget on any modern CPU, so the GPU's upside does not justify
 * the failure modes.
 *
 * @param delegate The requested delegate.
 * @return The delegate to pass to MediaPipe.
 */
function resolveDelegate(delegate: DetectorDelegate): DetectorDelegate.CPU | DetectorDelegate.GPU {
  if (delegate !== DetectorDelegate.AUTO) {
    return delegate;
  }
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isIOS ? DetectorDelegate.CPU : DetectorDelegate.GPU;
}

/**
 * Custom hook handling the lifecycle of the MediaPipe object detector : downloading the WASM runtime and the model,
 * creating the detector, falling back to the CPU when the GPU delegate fails, and releasing it on unmount.
 */
export function useObjectDetector({
  modelAssetPath,
  wasmBasePath,
  delegate,
}: UseObjectDetectorParams): ObjectDetectorHandle {
  const detectorRef = useRef<ObjectDetector | null>(null);
  const [status, setStatus] = useState<DetectorStatus>(DetectorStatus.LOADING);
  const [activeDelegate, setActiveDelegate] = useState<
    DetectorDelegate.CPU | DetectorDelegate.GPU | null
  >(null);
  const [requestedDelegate, setRequestedDelegate] = useState(() => resolveDelegate(delegate));
  const hasFallenBackRef = useRef(false);
  const { handleError } = useMonitoring();

  useEffect(() => setRequestedDelegate(resolveDelegate(delegate)), [delegate]);

  const fallBackToCpu = useCallback(() => {
    if (hasFallenBackRef.current || requestedDelegate === DetectorDelegate.CPU) {
      return;
    }
    hasFallenBackRef.current = true;
    setRequestedDelegate(DetectorDelegate.CPU);
  }, [requestedDelegate]);

  const reportInferenceFailure = useCallback(
    (error: unknown) => {
      handleError(error);
      fallBackToCpu();
    },
    [handleError, fallBackToCpu],
  );

  useEffect(() => {
    let cancelled = false;
    let created: ObjectDetector | null = null;

    const createDetector = async () => {
      setStatus(DetectorStatus.LOADING);
      setActiveDelegate(null);
      // `useModule` is deliberately left unset : the CommonJS build of tasks-vision loads `vision_wasm_internal.js`
      // by script injection, whereas passing `true` would look for the `vision_wasm_module_internal.js` variant.
      const fileset = await FilesetResolver.forVisionTasks(wasmBasePath);
      const detector = await ObjectDetector.createFromOptions(fileset, {
        baseOptions: { modelAssetPath, delegate: requestedDelegate },
        runningMode: 'VIDEO',
        scoreThreshold: MIN_DETECTION_SCORE,
        maxResults: MAX_DETECTION_RESULTS,
        categoryAllowlist: [...VEHICLE_CATEGORY_NAMES],
      });
      // Under StrictMode the effect is mounted twice, so this promise can resolve AFTER the cleanup has run. Closing
      // the orphan here is what prevents leaking a duplicated model and, on the GPU delegate, a WebGL context.
      if (cancelled) {
        detector.close();
        return;
      }
      created = detector;
      detectorRef.current = detector;
      setActiveDelegate(requestedDelegate);
      setStatus(DetectorStatus.READY);
    };

    createDetector().catch((err) => {
      if (cancelled) {
        return;
      }
      handleError(err);
      if (requestedDelegate === DetectorDelegate.GPU && !hasFallenBackRef.current) {
        fallBackToCpu();
        return;
      }
      setStatus(DetectorStatus.ERROR);
    });

    return () => {
      cancelled = true;
      detectorRef.current = null;
      created?.close();
      created = null;
    };
  }, [modelAssetPath, wasmBasePath, requestedDelegate, handleError, fallBackToCpu]);

  return useObjectMemo({ detectorRef, status, activeDelegate, reportInferenceFailure });
}
