import { useCallback, useRef, useState } from 'react';
import { DeviceRotation, VideoCaptureAppConfig } from '@monkvision/types';
import { useObjectMemo } from '@monkvision/common';
import {
  AlphaSample,
  detectFastMovements,
  FastMovementType,
  pruneAlphaHistory,
} from './fastMovementsDetection';
import { BlurDetectionState, createBlurDetectionState, updateBlurDetection } from './blurDetection';

/**
 * Params accepted by the useFastMovementsDetection hook.
 */
export interface UseFastMovementsDetectionParams
  extends Required<
      Pick<
        VideoCaptureAppConfig,
        | 'enableFastWalkingWarning'
        | 'enablePhoneShakingWarning'
        | 'fastWalkingWarningCooldown'
        | 'phoneShakingWarningCooldown'
      >
    >,
    Pick<VideoCaptureAppConfig, 'enableBlurryFramesWarning' | 'blurryFramesWarningCooldown'> {
  /**
   * Boolean indicating if the video is currently recording or not.
   */
  isRecording: boolean;
}

/**
 * Handle used to manage the fast movements warning displayed on the screen to the user.
 */
export interface FastMovementsDetectionHandle {
  /**
   * Event listener for device rotation updates.
   */
  onDeviceOrientationEvent: (rotation: DeviceRotation) => void;
  /**
   * Callback called with the Laplace score (sharpness) of every frame selected for upload, used to detect blurry
   * frames.
   */
  onSelectedFrameScore: (score: number) => void;
  /**
   * The type of fast movements warning that should be displayed to the user. If this value is null, no warning should
   * be displayed.
   */
  fastMovementsWarning: FastMovementType | null;
  /**
   * Callback called when the user dismisses the currently displayed fast movements warning.
   */
  onWarningDismiss: () => void;
  /**
   * Callback to reset the detection baseline.
   */
  resetDetection: () => void;
}

/**
 * Custom hook used to display warnings to the user when they walk too fast around the car, shake their phone too
 * much, or when the frames captured are too blurry.
 */
export function useFastMovementsDetection({
  isRecording,
  enableFastWalkingWarning,
  enablePhoneShakingWarning,
  fastWalkingWarningCooldown,
  phoneShakingWarningCooldown,
  enableBlurryFramesWarning = true,
  blurryFramesWarningCooldown = 1000,
}: UseFastMovementsDetectionParams): FastMovementsDetectionHandle {
  const [fastMovementsWarning, setFastMovementsWarning] = useState<FastMovementType | null>(null);
  const lastRotation = useRef<DeviceRotation | null>(null);
  const alphaHistory = useRef<AlphaSample[]>([]);
  const blurDetection = useRef<BlurDetectionState>(createBlurDetectionState());
  const warningTimestamps = useRef<Record<FastMovementType, number>>({
    [FastMovementType.WALKING_TOO_FAST]: 0,
    [FastMovementType.PHONE_SHAKING]: 0,
    [FastMovementType.BLURRY_FRAMES]: 0,
  });

  const isWarningEnabled = useCallback(
    (type: FastMovementType) => {
      switch (type) {
        case FastMovementType.WALKING_TOO_FAST:
          return enableFastWalkingWarning;
        case FastMovementType.PHONE_SHAKING:
          return enablePhoneShakingWarning;
        case FastMovementType.BLURRY_FRAMES:
          return enableBlurryFramesWarning;
        default:
          return false;
      }
    },
    [enableFastWalkingWarning, enablePhoneShakingWarning, enableBlurryFramesWarning],
  );

  const getWarningCooldown = useCallback(
    (type: FastMovementType) => {
      switch (type) {
        case FastMovementType.WALKING_TOO_FAST:
          return fastWalkingWarningCooldown;
        case FastMovementType.PHONE_SHAKING:
          return phoneShakingWarningCooldown;
        case FastMovementType.BLURRY_FRAMES:
          return blurryFramesWarningCooldown;
        default:
          return Infinity;
      }
    },
    [fastWalkingWarningCooldown, phoneShakingWarningCooldown, blurryFramesWarningCooldown],
  );

  const raiseWarning = useCallback(
    (type: FastMovementType, now: number): boolean => {
      if (
        !isWarningEnabled(type) ||
        now - warningTimestamps.current[type] <= getWarningCooldown(type)
      ) {
        return false;
      }
      setFastMovementsWarning(type);
      warningTimestamps.current[type] = now;
      return true;
    },
    [isWarningEnabled, getWarningCooldown],
  );

  const onDeviceOrientationEvent = useCallback(
    ({ alpha, beta, gamma }: DeviceRotation) => {
      const now = Date.now();
      alphaHistory.current = [
        ...pruneAlphaHistory(alphaHistory.current, now),
        { alpha, timestamp: now },
      ];

      if (lastRotation.current === null) {
        lastRotation.current = { alpha, beta, gamma };
        return;
      }

      if (isRecording) {
        const type = detectFastMovements(
          { alpha, beta, gamma },
          lastRotation.current,
          alphaHistory.current,
        );

        if (type) {
          raiseWarning(type, now);
        }
      }
      lastRotation.current = { alpha, beta, gamma };
    },
    [isRecording, raiseWarning],
  );

  const onSelectedFrameScore = useCallback(
    (score: number) => {
      if (!isRecording) {
        return;
      }
      const { state, isBlurry } = updateBlurDetection(blurDetection.current, score);
      blurDetection.current = state;
      if (isBlurry && raiseWarning(FastMovementType.BLURRY_FRAMES, Date.now())) {
        blurDetection.current = { ...state, consecutiveLow: 0 };
      }
    },
    [isRecording, raiseWarning],
  );

  const onWarningDismiss = useCallback(() => setFastMovementsWarning(null), []);

  const resetDetection = useCallback(() => {
    lastRotation.current = null;
    alphaHistory.current = [];
    blurDetection.current = createBlurDetectionState();
    setFastMovementsWarning(null);
  }, []);

  return useObjectMemo({
    onDeviceOrientationEvent,
    onSelectedFrameScore,
    fastMovementsWarning,
    onWarningDismiss,
    resetDetection,
  });
}
