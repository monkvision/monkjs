import { useObjectMemo } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useEffect, useRef, useCallback } from 'react';
import { useMonitoring } from '@monkvision/monitoring';

const CAPTURE_DURATION = 'capture_duration';

/**
 * Parameters of the useCaptureDuration hook.
 */
export interface CaptureDurationParams {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Boolean indicating if the inspection is completed or not.
   */
  isInspectionCompleted: boolean;
  /**
   * Interval in milliseconds for the heartbeat to update the duration.
   */
  heartbeatInterval?: number;
  /**
   * Idle timeout in milliseconds to pause the capture duration tracking.
   */
  idleTimeout?: number;
}

/**
 *  Handle used to manage the capture duration.
 */
export interface HandleCaptureDuration {
  /**
   * Callback to update the capture duration in the API.
   */
  updateDuration: () => Promise<number>;
}

/**
 * Custom hook used to track the duration of an inspection session.
 */
export function useCaptureDuration({
  apiConfig,
  inspectionId,
  isInspectionCompleted,
  heartbeatInterval = 30000,
  idleTimeout = 10000,
}: CaptureDurationParams): HandleCaptureDuration {
  const startTimeRef = useRef<number>(Date.now());
  const totalActiveTimeRef = useRef<number>(0);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<boolean>(false);
  const captureDurationRef = useRef<number>(0);
  const isActive = useRef<boolean>(true);
  const cycleCountRef = useRef<number>(0);

  const { updateAdditionalData } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  const pauseTracking = useCallback((): void => {
    if (isActive.current) {
      isActive.current = false;
      totalActiveTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
    }
  }, []);

  const resumeTracking = useCallback((): void => {
    if (!isActive.current) {
      startTimeRef.current = Date.now();
      isActive.current = true;
    }
  }, []);

  const updateDuration = useCallback(
    async (forceUpdate = false): Promise<number> => {
      if (isInspectionCompleted || pendingUpdateRef.current) {
        return 0;
      }
      if (forceUpdate) {
        totalActiveTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
      }
      try {
        pendingUpdateRef.current = true;
        let existingDuration = 0;
        await updateAdditionalData({
          id: inspectionId,
          callback: (existingData) => {
            existingDuration = existingData?.[CAPTURE_DURATION]
              ? (existingData?.[CAPTURE_DURATION] as number)
              : 0;
            return {
              ...existingData,
              capture_duration: existingDuration + totalActiveTimeRef.current,
            };
          },
        });
        captureDurationRef.current = existingDuration + totalActiveTimeRef.current;
        startTimeRef.current = Date.now();
        totalActiveTimeRef.current = 0;
        return captureDurationRef.current;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        pendingUpdateRef.current = false;
      }
    },
    [updateAdditionalData, inspectionId, isInspectionCompleted, handleError],
  );

  const restartIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearInterval(idleTimerRef.current);
    }
    idleTimerRef.current = setInterval(() => {
      pauseTracking();
    }, idleTimeout);
  }, [pauseTracking]);

  useEffect(() => {
    if (isInspectionCompleted) {
      return undefined;
    }
    const activityEvents: (keyof DocumentEventMap | keyof WindowEventMap)[] = [
      'touchstart',
      'touchmove',
      'touchend',
      'click',
      'scroll',
      'keydown',
      'mousedown',
      'mousemove',
    ];

    const handleActivity = (): void => {
      if (!isActive.current) {
        cycleCountRef.current += 1;
      }
      resumeTracking();
      restartIdleTimer();
      if (cycleCountRef.current >= 5) {
        updateDuration(true);
        cycleCountRef.current = 0;
      }
    };

    const handleBeforeUnload = (): void => {
      updateDuration();
    };

    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        updateDuration();
        pauseTracking();
      } else {
        resumeTracking();
      }
    };

    heartbeatTimerRef.current = setInterval(() => {
      if (isActive.current) {
        updateDuration(true);
      }
    }, heartbeatInterval);

    restartIdleTimer();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      if (idleTimerRef.current) {
        clearInterval(idleTimerRef.current);
      }
    };
  }, [
    pauseTracking,
    resumeTracking,
    updateDuration,
    heartbeatInterval,
    isInspectionCompleted,
    restartIdleTimer,
  ]);

  return useObjectMemo({ updateDuration });
}
