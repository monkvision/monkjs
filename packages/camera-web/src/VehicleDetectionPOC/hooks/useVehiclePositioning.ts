import { RefObject, useCallback, useRef, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import {
  DEFAULT_INFERENCE_WIDTH,
  DEFAULT_MODEL_ASSET_PATH,
  DEFAULT_TARGET_BOX,
  DEFAULT_WASM_BASE_PATH,
  VIBRATE_COOLDOWN_MS,
  VIBRATE_DURATION_MS,
} from '../constants';
import {
  CenterBox,
  DetectorDelegate,
  PositioningMetrics,
  VehiclePositioningResult,
  VehiclePositioningState,
} from '../types';
import { commitState, createStateCommit, decideVehiclePositioningState } from '../utils';
import { useObjectDetector } from './useObjectDetector';
import { useVehicleDetection } from './useVehicleDetection';

/**
 * Params accepted by the useVehiclePositioning hook.
 */
export interface UseVehiclePositioningParams {
  /**
   * Ref to the video element displaying the camera preview. Available on the Camera handle as `handle.videoRef`.
   */
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * The static target frame the vehicle should fill, in normalized frame coordinates.
   *
   * @default DEFAULT_TARGET_BOX
   */
  targetBox?: CenterBox;
  /**
   * The URL of the `.tflite` model to load. The model is not shipped inside the package, it has to be served by the
   * host application.
   *
   * @default DEFAULT_MODEL_ASSET_PATH
   */
  modelAssetPath?: string;
  /**
   * The base URL of the MediaPipe vision WASM runtime.
   *
   * @default DEFAULT_WASM_BASE_PATH
   */
  wasmBasePath?: string;
  /**
   * Which backend the model should run on.
   *
   * @default DetectorDelegate.AUTO
   */
  delegate?: DetectorDelegate;
  /**
   * The width the camera frames are downscaled to before inference, or null to run inference on the full resolution
   * frames. Strongly recommended : the Camera component requests a 4K preview on mobile devices.
   *
   * @default DEFAULT_INFERENCE_WIDTH
   */
  inferenceWidth?: number | null;
  /**
   * The smoothing factor applied to the center of the vehicle box.
   *
   * @default EMA_ALPHA_POSITION
   */
  alphaPosition?: number;
  /**
   * The smoothing factor applied to the size of the vehicle box.
   *
   * @default EMA_ALPHA_SIZE
   */
  alphaSize?: number;
  /**
   * Whether the raw, unsmoothed detections should be kept so that they can be drawn by the debug overlay.
   *
   * @default false
   */
  keepRawDetections?: boolean;
  /**
   * Called whenever the committed positioning state changes.
   */
  onStateChange?: (state: VehiclePositioningState) => void;
}

/**
 * Fires a short haptic feedback, if the device supports it.
 *
 * Note: The Vibration API does not exist on any version of iOS Safari. This is not a permission issue, the API is
 * simply absent, which is why the perfectly-framed state must also be obvious visually.
 */
function vibrate(): void {
  if (typeof navigator.vibrate !== 'function') {
    return;
  }
  try {
    navigator.vibrate(VIBRATE_DURATION_MS);
  } catch {
    // Vibration is best effort : some browsers reject it without a prior user gesture on the page.
  }
}

/**
 * Custom hook guiding the user into framing a vehicle inside a target frame.
 *
 * It runs an EfficientDet-Lite0 object detector over the camera stream at 10 FPS, smooths the detected vehicle box
 * with an exponential moving average, and compares it to the target frame to produce a single, actionable
 * instruction. Three independent layers keep that instruction stable, and all three are needed : the moving average
 * smooths the *geometry*, the hysteresis bands widen the decision *boundaries*, and a dwell timer debounces the
 * discrete *output*.
 *
 * @example
 * const { state, smoothedBox } = useVehiclePositioning({ videoRef: handle.videoRef });
 */
export function useVehiclePositioning({
  videoRef,
  targetBox = DEFAULT_TARGET_BOX,
  modelAssetPath = DEFAULT_MODEL_ASSET_PATH,
  wasmBasePath = DEFAULT_WASM_BASE_PATH,
  delegate = DetectorDelegate.AUTO,
  inferenceWidth = DEFAULT_INFERENCE_WIDTH,
  alphaPosition,
  alphaSize,
  keepRawDetections = false,
  onStateChange,
}: UseVehiclePositioningParams): VehiclePositioningResult {
  const [state, setState] = useState(VehiclePositioningState.NO_CAR_DETECTED);
  const commitRef = useRef(createStateCommit(0));
  const lastVibrateAtRef = useRef(0);
  const { detectorRef, status, activeDelegate, reportInferenceFailure } = useObjectDetector({
    modelAssetPath,
    wasmBasePath,
    delegate,
  });

  const onSample = useCallback(
    (metrics: PositioningMetrics | null, now: number) => {
      const previous = commitRef.current.committed;
      commitRef.current = commitState(
        commitRef.current,
        decideVehiclePositioningState(metrics, previous),
        now,
      );
      const { committed } = commitRef.current;
      if (committed === previous) {
        return;
      }
      // Rising edge only : the feedback marks the transition into a well framed vehicle, not the fact of staying
      // there, which would otherwise buzz continuously.
      if (
        committed === VehiclePositioningState.PERFECT &&
        now - lastVibrateAtRef.current > VIBRATE_COOLDOWN_MS
      ) {
        lastVibrateAtRef.current = now;
        vibrate();
      }
      setState(committed);
      onStateChange?.(committed);
    },
    [onStateChange],
  );

  const { smoothedBox, rawDetections, metrics, inferenceMs, candidateCount } = useVehicleDetection({
    videoRef,
    detectorRef,
    detectorStatus: status,
    reportInferenceFailure,
    targetBox,
    inferenceWidth,
    alphaPosition,
    alphaSize,
    keepRawDetections,
    onSample,
  });

  return useObjectMemo({
    state,
    detectorStatus: status,
    delegate: activeDelegate,
    smoothedBox,
    rawDetections,
    metrics,
    targetBox,
    inferenceMs,
    candidateCount,
  });
}
