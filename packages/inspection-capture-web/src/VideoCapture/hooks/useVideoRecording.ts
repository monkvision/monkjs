import { useState } from 'react';
import { useInterval } from '@monkvision/common';
import { VehicleWalkaroundHandle } from './useVehicleWalkaround';

/**
 * Params accepted by the useVideoRecording hook.
 */
export interface UseVideoRecordingParams
  extends Pick<VehicleWalkaroundHandle, 'walkaroundPosition' | 'startWalkaround'> {
  /**
   * The interval in milliseconds at which screenshots of the video stream should be taken.
   */
  screenshotInterval: number;
  /**
   * The minimum duration of a recording.
   *
   * If the user tries to stop the recording too soon, the recording will be paused, and a warning dialog will be
   * displayed on the screen, asking the user if they want to restart the recording over, or resume recording the
   * vehicle walkaround.
   */
  minRecordingDuration: number;
  /**
   * Callback called when a screenshot of the video stream should be taken and then added to the processing queue.
   */
  onCaptureVideoFrame?: () => void;
  /**
   * Callback called when the recording is complete.
   */
  onRecordingComplete?: () => void;
}

/**
 * Handle returned by the useVideoRecording hook used to maange the video recording (AKA : The process of taking
 * screenshots of the video stream at a given interval).
 */
export interface VideoRecordingHandle {
  /**
   * Boolean indicating if the video is currently recording or not.
   */
  isRecording: boolean;
  /**
   * Boolean indicating if the video recording is paused or not.
   */
  isRecordingPaused: boolean;
  /**
   * The total duration (in milliseconds) of the current video recording.
   */
  recordingDurationMs: number;
  /**
   * Callback called when the user clicks on the record video button.
   */
  onClickRecordVideo: () => void;
  /**
   * Boolean indicating if the discard video dialog should be displayed on the screen or not.
   */
  isDiscardDialogDisplayed: boolean;
  /**
   * Callback called when the user clicks on the "Keep Recording" option of the discard video dialog.
   */
  onDiscardDialogKeepRecording: () => void;
  /**
   * Callback called when the user clicks on the "Discard Video" option of the discard video dialog.
   */
  onDiscardDialogDiscardVideo: () => void;
}

const MINIMUM_VEHICLE_WALKAROUND_POSITION = 270;

/**
 * Custom hook used to manage the video recording (AKA : The process of taking screenshots of the video stream at a
 * given interval).
 */
export function useVideoRecording({
  screenshotInterval,
  minRecordingDuration,
  walkaroundPosition,
  startWalkaround,
  onCaptureVideoFrame,
  onRecordingComplete,
}: UseVideoRecordingParams): VideoRecordingHandle {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [additionalRecordingDuration, setAdditionalRecordingDuration] = useState(0);
  const [recordingStartTimestamp, setRecordingStartTimestamp] = useState<number | null>(null);
  const [isDiscardDialogDisplayed, setDiscardDialogDisplayed] = useState(false);

  const recordingDurationMs =
    additionalRecordingDuration +
    (recordingStartTimestamp ? Date.now() - recordingStartTimestamp : 0);

  const pauseRecording = () => {
    setAdditionalRecordingDuration((value) =>
      recordingStartTimestamp ? value + Date.now() - recordingStartTimestamp : value,
    );
    setRecordingStartTimestamp(null);
    setIsRecording(false);
    setIsRecordingPaused(true);
  };

  const resumeRecording = () => {
    setRecordingStartTimestamp(Date.now());
    setIsRecording(true);
    setIsRecordingPaused(false);
  };

  const onClickRecordVideo = () => {
    if (isRecording) {
      if (
        recordingDurationMs < minRecordingDuration ||
        walkaroundPosition < MINIMUM_VEHICLE_WALKAROUND_POSITION
      ) {
        pauseRecording();
        setDiscardDialogDisplayed(true);
      } else {
        setIsRecording(false);
        onRecordingComplete?.();
      }
    } else {
      setAdditionalRecordingDuration(0);
      setRecordingStartTimestamp(Date.now());
      setIsRecording(true);
      startWalkaround();
    }
  };

  const onDiscardDialogKeepRecording = () => {
    resumeRecording();
    setDiscardDialogDisplayed(false);
  };

  const onDiscardDialogDiscardVideo = () => {
    setIsRecordingPaused(false);
    setAdditionalRecordingDuration(0);
    setRecordingStartTimestamp(null);
    setIsRecording(false);
    setDiscardDialogDisplayed(false);
  };

  useInterval(
    () => {
      if (isRecording) {
        onCaptureVideoFrame?.();
      }
    },
    isRecording ? screenshotInterval : null,
  );

  return {
    isRecording,
    isRecordingPaused,
    recordingDurationMs,
    onClickRecordVideo,
    onDiscardDialogKeepRecording,
    onDiscardDialogDiscardVideo,
    isDiscardDialogDisplayed,
  };
}
