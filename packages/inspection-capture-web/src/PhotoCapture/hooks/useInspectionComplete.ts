import { LoadingState, useObjectMemo, usePreventExit } from '@monkvision/common';
import { useCallback, useEffect } from 'react';
import { useAnalytics } from '@monkvision/analytics';
import { useMonitoring } from '@monkvision/monitoring';
import { PhotoCaptureAppConfig } from '@monkvision/types';
import { StartTasksFunction } from '../../hooks';
import { PhotoCaptureSightState } from './usePhotoCaptureSightState';

/**
 * Parameters of the useInspectionComplete hook.
 */
export interface InspectionCompleteParams
  extends Pick<PhotoCaptureAppConfig, 'startTasksOnComplete'> {
  /**
   * Callback called when the user has started the inspection tasks.
   */
  startTasks: StartTasksFunction;
  /**
   * The sight state, created using the usePhotoCaptureSightState hook.
   */
  sightState: PhotoCaptureSightState;
  /**
   * Global loading state of the PhotoCapture component.
   */
  loading: LoadingState;
  /**
   * Callback called when the user clicks on the "Complete" button in the HUD.
   */
  onComplete?: () => void;
}

/**
 * Handle used to manage the completion of the inspection.
 */
export interface InspectionCompleteHandle {
  /**
   * Callback called when the user has completed the inspection.
   */
  handleInspectionCompleted: () => void;
}

/**
 * Custom hook used to generate the callback called when the user has completed the inspection.
 */
export function useInspectionComplete({
  startTasks,
  sightState,
  loading,
  startTasksOnComplete,
  onComplete,
}: InspectionCompleteParams): InspectionCompleteHandle {
  const analytics = useAnalytics();
  const monitoring = useMonitoring();
  const { allowRedirect } = usePreventExit(sightState.sightsTaken.length !== 0);

  const handleInspectionCompleted = useCallback(() => {
    startTasks()
      .then(() => {
        analytics.trackEvent('Capture Completed');
        analytics.setUserProperties({
          captureCompleted: true,
          sightSelected: 'inspection-completed',
        });
        allowRedirect();
        onComplete?.();
        sightState.setIsInspectionCompleted(true);
      })
      .catch((err) => {
        loading.onError(err);
        monitoring.handleError(err);
      });
  }, []);

  useEffect(() => {
    const { isInspectionCompliant, isInspectionCompleted } = sightState;
    if (startTasksOnComplete && isInspectionCompliant && !isInspectionCompleted) {
      handleInspectionCompleted();
    }
  }, [sightState.isInspectionCompliant]);

  return useObjectMemo({ handleInspectionCompleted });
}
