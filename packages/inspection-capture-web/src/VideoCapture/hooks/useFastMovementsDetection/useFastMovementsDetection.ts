import { useCallback, useRef, useState } from 'react';
import { DeviceRotation, VideoCaptureAppConfig } from '@monkvision/types';
import { useObjectMemo } from '@monkvision/common';
import {
  AlphaSample,
  detectFastMovements,
  FastMovementType,
  pruneAlphaHistory,
} from './fastMovementsDetection';

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
  > {
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
 * Custom hook used to display warnings to the user when they walk too fast around the car or shake their phone too
 * much.
 */
export function useFastMovementsDetection({
  isRecording,
  enableFastWalkingWarning,
  enablePhoneShakingWarning,
  fastWalkingWarningCooldown,
  phoneShakingWarningCooldown,
}: UseFastMovementsDetectionParams): FastMovementsDetectionHandle {
  const [fastMovementsWarning, setFastMovementsWarning] = useState<FastMovementType | null>(null);
  const lastRotation = useRef<DeviceRotation | null>(null);
  const alphaHistory = useRef<AlphaSample[]>([]);
  const warningTimestamps = useRef<Record<FastMovementType, number>>({
    [FastMovementType.WALKING_TOO_FAST]: 0,
    [FastMovementType.PHONE_SHAKING]: 0,
  });

  const isWarningEnabled = useCallback(
    (type: FastMovementType) => {
      switch (type) {
        case FastMovementType.WALKING_TOO_FAST:
          return enableFastWalkingWarning;
        case FastMovementType.PHONE_SHAKING:
          return enablePhoneShakingWarning;
        default:
          return false;
      }
    },
    [enableFastWalkingWarning, enablePhoneShakingWarning],
  );

  const getWarningCooldown = useCallback(
    (type: FastMovementType) => {
      switch (type) {
        case FastMovementType.WALKING_TOO_FAST:
          return fastWalkingWarningCooldown;
        case FastMovementType.PHONE_SHAKING:
          return phoneShakingWarningCooldown;
        default:
          return Infinity;
      }
    },
    [fastWalkingWarningCooldown, phoneShakingWarningCooldown],
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

        if (
          type &&
          isWarningEnabled(type) &&
          now - warningTimestamps.current[type] > getWarningCooldown(type)
        ) {
          setFastMovementsWarning(type);
          warningTimestamps.current[type] = now;
        }
      }
      lastRotation.current = { alpha, beta, gamma };
    },
    [isRecording, isWarningEnabled, getWarningCooldown],
  );

  const onWarningDismiss = useCallback(() => setFastMovementsWarning(null), []);

  const resetDetection = useCallback(() => {
    lastRotation.current = null;
    alphaHistory.current = [];
    setFastMovementsWarning(null);
  }, []);

  return useObjectMemo({
    onDeviceOrientationEvent,
    fastMovementsWarning,
    onWarningDismiss,
    resetDetection,
  });
}
