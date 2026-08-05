import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useInterval } from '@monkvision/common';
import { VideoCaptureAppConfig, VideoUploadStrategy } from '@monkvision/types';
import { VehicleWalkaroundHandle } from './useVehicleWalkaround';
import { useEnforceOrientation } from '../../hooks';

/**
 * Enumeration of the different tooltips displayed on top of the recording button during the recording process.
 */
export enum VideoRecordingTooltip {
  /**
   * Tooltip displayed before the recording has been started, to indicate to the user where to press to start the
   * recording.
   */
  START = 'start',
  /**
   * Tooltip displayed at the end of the recording, to indicate to the user where to press to stop the recording.
   */
  END = 'end',
}

/**
 * Params accepted by the useVideoRecording hook.
 */
export interface UseVideoRecordingParams
  extends Pick<VehicleWalkaroundHandle, 'startWalkaround' | 'coveragePercentage'>,
    Pick<VideoCaptureAppConfig, 'enforceOrientation'> {
  /**
   * Boolean indicating if the video is currently recording or not.
   */
  isRecording: boolean;
  /**
   * Callback called when setting the `isRecording` state.
   */
  setIsRecording: Dispatch<SetStateAction<boolean>>;
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
   * The strategy used to decide when a frame of the video should be selected and uploaded.
   *
   * When set to `VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE`, the recording can only be completed once
   * `targetFramesCount` frames have been captured (in addition to `minRecordingDuration` being reached),
   * instead of the vehicle walkaround coverage percentage.
   */
  videoUploadStrategy: VideoUploadStrategy;
  /**
   * The number of frames captured so far during the current walkaround. Only used when `videoUploadStrategy` is set
   * to `VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE`.
   */
  capturedFramesCount: number;
  /**
   * The target number of frames to capture over a full 360° walkaround. Only used when `videoUploadStrategy` is set
   * to `VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE`.
   */
  targetFramesCount: number;
  /**
   * Callback called when a screenshot of the video stream should be taken and then added to the processing queue.
   */
  onCaptureVideoFrame?: () => void;
  /**
   * Callback called when the recording is complete.
   */
  onRecordingComplete?: () => void;
  /**
   * Callback to reset fast movement detection baseline.
   */
  resetFastMovementDetection?: () => void;
}

/**
 * Handle returned by the useVideoRecording hook used to maange the video recording (AKA : The process of taking
 * screenshots of the video stream at a given interval).
 */
export interface VideoRecordingHandle {
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
  /**
   * Callback called to pause the video recording.
   */
  pauseRecording: () => void;
  /**
   * Callback called to resume the video recording after it has been paused.
   */
  resumeRecording: () => void;
  /**
   * The tooltip displayed to the user.
   */
  tooltip: VideoRecordingTooltip | null;
  /**
   * Boolean indicating if the discard dialog is displayed because the target frame count has not been reached yet
   * (only relevant when `videoUploadStrategy` is set to `VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE`), as opposed to
   * the vehicle walkaround coverage not being high enough.
   */
  isMissingTargetFrames: boolean;
}

export const MINIMUM_PERCENTAGE_VEHICLE_WALKAROUND_COVERAGE = 87;

/**
 * Custom hook used to manage the video recording (AKA : The process of taking screenshots of the video stream at a
 * given interval).
 */
export function useVideoRecording({
  isRecording,
  setIsRecording,
  screenshotInterval,
  minRecordingDuration,
  enforceOrientation,
  coveragePercentage,
  videoUploadStrategy,
  capturedFramesCount,
  targetFramesCount,
  startWalkaround,
  onCaptureVideoFrame,
  onRecordingComplete,
  resetFastMovementDetection,
}: UseVideoRecordingParams): VideoRecordingHandle {
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [additionalRecordingDuration, setAdditionalRecordingDuration] = useState(0);
  const [recordingStartTimestamp, setRecordingStartTimestamp] = useState<number | null>(null);
  const [isDiscardDialogDisplayed, setDiscardDialogDisplayed] = useState(false);
  const [isMissingTargetFrames, setIsMissingTargetFrames] = useState(false);
  const [orientationPause, setOrientationPause] = useState(false);
  const [tooltip, setTooltip] = useState<VideoRecordingTooltip | null>(VideoRecordingTooltip.START);
  const isViolatingEnforcedOrientation = useEnforceOrientation(enforceOrientation);
  const isAdaptiveUploadRate = videoUploadStrategy === VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE;

  const getRecordingDurationMs = useCallback(
    () =>
      additionalRecordingDuration +
      (recordingStartTimestamp ? Date.now() - recordingStartTimestamp : 0),
    [additionalRecordingDuration, recordingStartTimestamp],
  );

  const pauseRecording = useCallback(() => {
    setIsRecordingPaused((isRecordingPausedValue) => {
      if (!isRecordingPausedValue) {
        setIsRecording(false);
        setRecordingStartTimestamp((recordingStartTimestampValue) => {
          setAdditionalRecordingDuration((value) =>
            recordingStartTimestampValue
              ? value + Date.now() - recordingStartTimestampValue
              : value,
          );
          return null;
        });
      }
      return true;
    });
  }, [setIsRecording]);

  const resumeRecording = useCallback(() => {
    setIsRecordingPaused((isRecordingPausedValue) => {
      if (isRecordingPausedValue) {
        setRecordingStartTimestamp(Date.now());
        setIsRecording(true);
      }
      return false;
    });
  }, [setIsRecording]);

  const onClickRecordVideo = useCallback(() => {
    if (isRecording) {
      const isDurationTooShort = getRecordingDurationMs() < minRecordingDuration;
      const isMissingCoverage = isAdaptiveUploadRate
        ? capturedFramesCount < targetFramesCount
        : coveragePercentage < MINIMUM_PERCENTAGE_VEHICLE_WALKAROUND_COVERAGE;
      if (isDurationTooShort || isMissingCoverage) {
        setIsMissingTargetFrames(isAdaptiveUploadRate && isMissingCoverage);
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
      resetFastMovementDetection?.();
      startWalkaround();
      setTooltip(null);
    }
  }, [
    isRecording,
    getRecordingDurationMs,
    minRecordingDuration,
    coveragePercentage,
    isAdaptiveUploadRate,
    capturedFramesCount,
    targetFramesCount,
    pauseRecording,
    onRecordingComplete,
    setIsRecording,
    startWalkaround,
    resetFastMovementDetection,
  ]);

  const onDiscardDialogKeepRecording = useCallback(() => {
    resumeRecording();
    setDiscardDialogDisplayed(false);
  }, [resumeRecording]);

  const onDiscardDialogDiscardVideo = useCallback(() => {
    setIsRecordingPaused(false);
    setAdditionalRecordingDuration(0);
    setRecordingStartTimestamp(null);
    setIsRecording(false);
    setDiscardDialogDisplayed(false);
  }, [setIsRecording]);

  useInterval(
    () => {
      if (isRecording) {
        onCaptureVideoFrame?.();
      }
    },
    isRecording ? screenshotInterval : null,
  );

  useEffect(() => {
    if (isViolatingEnforcedOrientation && isRecording) {
      setOrientationPause(true);
      pauseRecording();
    } else if (!isViolatingEnforcedOrientation && orientationPause) {
      setOrientationPause(false);
      resumeRecording();
    }
  }, [
    isViolatingEnforcedOrientation,
    isRecording,
    orientationPause,
    pauseRecording,
    resumeRecording,
  ]);

  useEffect(() => {
    if (isRecording) {
      const isCoverageReached = isAdaptiveUploadRate
        ? capturedFramesCount >= targetFramesCount
        : coveragePercentage > MINIMUM_PERCENTAGE_VEHICLE_WALKAROUND_COVERAGE;
      setTooltip(isCoverageReached ? VideoRecordingTooltip.END : null);
    }
  }, [
    coveragePercentage,
    isAdaptiveUploadRate,
    capturedFramesCount,
    targetFramesCount,
    isRecording,
  ]);

  return {
    isRecordingPaused,
    recordingDurationMs: getRecordingDurationMs(),
    onClickRecordVideo,
    onDiscardDialogKeepRecording,
    onDiscardDialogDiscardVideo,
    isDiscardDialogDisplayed,
    isMissingTargetFrames,
    pauseRecording,
    resumeRecording,
    tooltip,
  };
}
