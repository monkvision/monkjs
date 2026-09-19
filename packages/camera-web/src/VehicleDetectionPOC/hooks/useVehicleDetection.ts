import { MutableRefObject, RefObject, useCallback, useRef, useState } from 'react';
import { ObjectDetector } from '@mediapipe/tasks-vision';
import { PixelDimensions } from '@monkvision/types';
import { useInterval } from '@monkvision/common';
import {
  DETECTION_INTERVAL_MS,
  EMA_ALPHA_POSITION,
  EMA_ALPHA_SIZE,
  INFERENCE_BUDGET_MS,
  JUMP_IOU_MIN,
  LOSS_GRACE_TICKS,
} from '../constants';
import { CenterBox, DetectorStatus, PositioningMetrics, VehicleDetection } from '../types';
import {
  applyEma,
  getGuideBox,
  getInferenceDimensions,
  getIou,
  getPositioningMetrics,
  getTimeCorrectedAlpha,
  getVehicleCandidates,
  selectVehicleDetection,
} from '../utils';

/**
 * The minimum `readyState` a video element must have for its current frame to be uploadable as a texture.
 */
const HAVE_CURRENT_DATA = 2;

/**
 * Params accepted by the useVehicleDetection hook.
 */
export interface UseVehicleDetectionParams {
  /**
   * Ref to the video element displaying the camera preview.
   */
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * Ref to the object detector to run.
   */
  detectorRef: MutableRefObject<ObjectDetector | null>;
  /**
   * The status of the detector. The loop only runs while this is `DetectorStatus.READY`.
   */
  detectorStatus: DetectorStatus;
  /**
   * Called when an inference call throws, so that the detector can fall back to another delegate.
   */
  reportInferenceFailure: (error: unknown) => void;
  /**
   * The width the camera frames are downscaled to before inference, or null to run on the frames as-is.
   */
  inferenceWidth: number | null;
  /**
   * The smoothing factor applied to the center of the vehicle box.
   */
  alphaPosition?: number;
  /**
   * The smoothing factor applied to the size of the vehicle box.
   */
  alphaSize?: number;
  /**
   * Whether the raw, unsmoothed detections should be kept for the debug overlay.
   */
  keepRawDetections: boolean;
  /**
   * Called on every tick of the loop with the resulting metrics, or null once the tracked vehicle has been lost for
   * longer than the grace period. This is what drives the positioning state machine.
   */
  onSample: (metrics: PositioningMetrics | null, now: number) => void;
}

/**
 * The handle returned by the useVehicleDetection hook.
 */
export interface VehicleDetectionHandle {
  /**
   * The EMA-smoothed vehicle box, or null if no vehicle is currently tracked.
   */
  smoothedBox: CenterBox | null;
  /**
   * The raw, unsmoothed detections of the last tick. Empty unless `keepRawDetections` is enabled.
   */
  rawDetections: VehicleDetection[];
  /**
   * The metrics of the smoothed box against the guide band, or null if no vehicle is tracked.
   */
  metrics: PositioningMetrics | null;
  /**
   * The guide band derived from the current frame dimensions, or null until the stream has reported them.
   */
  guideBox: CenterBox | null;
  /**
   * How long the last inference call took, in milliseconds.
   */
  inferenceMs: number;
  /**
   * The number of vehicle candidates returned by the last tick.
   */
  candidateCount: number;
}

/**
 * Custom hook running the object detection loop over the camera stream at a fixed rate, and smoothing the resulting
 * bounding box.
 *
 * The rate is capped well below the video frame rate because running inference on every frame would drain a phone's
 * battery for no benefit : positioning guidance is read by a human, who cannot act faster than that anyway. See
 * `DETECTION_INTERVAL_MS`.
 */
export function useVehicleDetection({
  videoRef,
  detectorRef,
  detectorStatus,
  reportInferenceFailure,
  inferenceWidth,
  alphaPosition = EMA_ALPHA_POSITION,
  alphaSize = EMA_ALPHA_SIZE,
  keepRawDetections,
  onSample,
}: UseVehicleDetectionParams): VehicleDetectionHandle {
  const [handle, setHandle] = useState<VehicleDetectionHandle>({
    smoothedBox: null,
    rawDetections: [],
    metrics: null,
    guideBox: null,
    inferenceMs: 0,
    candidateCount: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smoothedRef = useRef<CenterBox | null>(null);
  const missCountRef = useRef(0);
  const lastSampleAtRef = useRef(0);
  const lastCurrentTimeRef = useRef(-1);
  // Lives outside the detector lifecycle and never decreases: MediaPipe's VIDEO mode requires strictly increasing
  // timestamps, and recreating the detector must not reset the clock backwards.
  const lastTimestampRef = useRef(0);
  const skipUntilRef = useRef(0);

  /**
   * Downscales the current video frame into a private canvas, preserving the aspect ratio, and returns the canvas to
   * feed the detector. Falls back to the video element itself if downscaling is disabled or unavailable.
   */
  const getInferenceSource = useCallback(
    (
      video: HTMLVideoElement,
    ): { source: HTMLVideoElement | HTMLCanvasElement; dimensions: PixelDimensions } => {
      const intrinsic = { width: video.videoWidth, height: video.videoHeight };
      const dimensions = getInferenceDimensions(intrinsic, inferenceWidth);
      if (dimensions.width === intrinsic.width && dimensions.height === intrinsic.height) {
        return { source: video, dimensions: intrinsic };
      }
      canvasRef.current ??= document.createElement('canvas');
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) {
        return { source: video, dimensions: intrinsic };
      }
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      context.drawImage(video, 0, 0, dimensions.width, dimensions.height);
      return { source: canvas, dimensions };
    },
    [inferenceWidth],
  );

  /**
   * Feeds the observation of the current tick into the smoothing accumulator and reports the resulting metrics.
   */
  const updateTracking = useCallback(
    (
      detection: VehicleDetection | null,
      isNewTrack: boolean,
      now: number,
      frame: PixelDimensions,
    ) => {
      if (!detection) {
        missCountRef.current += 1;
        // Below the grace threshold the last known box is held : a single dropped frame caused by motion blur or a
        // bad exposure is very common, and must not make the UI flash.
        if (missCountRef.current > LOSS_GRACE_TICKS) {
          smoothedRef.current = null;
        }
        const metrics = smoothedRef.current
          ? getPositioningMetrics(smoothedRef.current, frame)
          : null;
        onSample(metrics, now);
        return { smoothedBox: smoothedRef.current, metrics };
      }

      missCountRef.current = 0;
      const previous = smoothedRef.current;
      // A newly acquired track, or a box that barely overlaps the current one, is a different vehicle. Interpolating
      // across that teleport would drag the box through geometries the vehicle never occupied, emitting a sequence of
      // instructions that never actually applied.
      const isJump = isNewTrack || !previous || getIou(detection.box, previous) < JUMP_IOU_MIN;
      const dtMs = lastSampleAtRef.current ? now - lastSampleAtRef.current : DETECTION_INTERVAL_MS;
      lastSampleAtRef.current = now;

      const smoothed = isJump
        ? detection.box
        : applyEma(
            previous,
            detection.box,
            getTimeCorrectedAlpha(alphaPosition, dtMs),
            getTimeCorrectedAlpha(alphaSize, dtMs),
          );
      smoothedRef.current = smoothed;
      const metrics = getPositioningMetrics(smoothed, frame);
      onSample(metrics, now);
      return { smoothedBox: smoothed, metrics };
    },
    [alphaPosition, alphaSize, onSample],
  );

  const tick = useCallback(() => {
    const video = videoRef.current;
    const detector = detectorRef.current;
    const now = performance.now();

    // Guards are ordered cheapest and most-likely-to-bail first.
    if (!video || !detector || now < skipUntilRef.current) {
      return;
    }
    // A backgrounded tab freezes the stream on iOS without stopping this interval, which would otherwise keep
    // re-detecting the same frozen frame and reporting a confident, stale instruction.
    if (document.visibilityState !== 'visible') {
      smoothedRef.current = null;
      lastCurrentTimeRef.current = -1;
      return;
    }
    if (video.readyState < HAVE_CURRENT_DATA || video.paused || !video.videoWidth) {
      return;
    }
    // Skip frames that have already been processed. iOS Safari has no requestVideoFrameCallback, so this is the only
    // way to avoid handing the same frame to the detector twice.
    if (video.currentTime === lastCurrentTimeRef.current) {
      return;
    }
    lastCurrentTimeRef.current = video.currentTime;

    // The guide band depends on the frame's aspect ratio, and iOS lowers the capture resolution under thermal
    // pressure, so it is derived per tick from the live intrinsic dimensions rather than captured once.
    const frame = { width: video.videoWidth, height: video.videoHeight };
    const guideBox = getGuideBox(frame);
    const { source, dimensions } = getInferenceSource(video);
    const timestamp = Math.max(Math.round(now), lastTimestampRef.current + 1);
    lastTimestampRef.current = timestamp;

    const startedAt = performance.now();
    let candidates: VehicleDetection[];
    try {
      candidates = getVehicleCandidates(
        detector.detectForVideo(source, timestamp).detections,
        dimensions,
      );
    } catch (err) {
      reportInferenceFailure(err);
      return;
    }
    const inferenceMs = performance.now() - startedAt;
    // `detectForVideo` is synchronous, so a call that overruns the interval would saturate the main thread and make
    // the preview stutter. Skipping ahead trades frame rate for a responsive UI, which is the right way round.
    if (inferenceMs > INFERENCE_BUDGET_MS) {
      skipUntilRef.current = now + inferenceMs;
    }

    const selection = selectVehicleDetection(candidates, smoothedRef.current, guideBox);
    const { smoothedBox, metrics } = updateTracking(
      selection?.detection ?? null,
      selection?.isNewTrack ?? false,
      now,
      frame,
    );

    setHandle({
      smoothedBox,
      metrics,
      guideBox,
      inferenceMs,
      candidateCount: candidates.length,
      rawDetections: keepRawDetections ? candidates : [],
    });
  }, [
    videoRef,
    detectorRef,
    reportInferenceFailure,
    getInferenceSource,
    updateTracking,
    keepRawDetections,
  ]);

  useInterval(tick, detectorStatus === DetectorStatus.READY ? DETECTION_INTERVAL_MS : null);

  // Already a single state object, so it is referentially stable between two ticks by construction.
  return handle;
}
