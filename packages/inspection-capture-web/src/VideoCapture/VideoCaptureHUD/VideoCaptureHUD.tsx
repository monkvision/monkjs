import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { CameraHUDProps } from '@monkvision/camera-web';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { ImageUploadType, MonkApiConfig, useMonkApi } from '@monkvision/network';
import { LoadingState } from '@monkvision/common';
import { DeviceRotation, VideoCaptureAppConfig, VideoUploadStrategy } from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { styles } from './VideoCaptureHUD.styles';
import { VideoCaptureRecording } from './VideoCaptureRecording';
import {
  FastMovementsDetectionHandle,
  FastMovementType,
  MINIMUM_PERCENTAGE_VEHICLE_WALKAROUND_COVERAGE,
  useFrameSelection,
  useSegmentFrameSelection,
  useVehicleWalkaround,
  useVideoRecording,
  UseVideoRecordingParams,
  useVideoUploadQueue,
  VideoRecordingTooltip,
} from '../hooks';
import { VideoCaptureProcessing } from '../VideoCaptureProcessing';
import { OrientationEnforcer } from '../../components';
import { VideoCaptureComplete } from './VideoCaptureComplete';

/**
 * Props accepted by the VideoCaptureHUD component.
 */
export interface VideoCaptureHUDProps
  extends CameraHUDProps,
    Pick<
      UseVideoRecordingParams,
      'minRecordingDuration' | 'videoUploadStrategy' | 'targetFramesCount'
    >,
    Pick<VideoCaptureAppConfig, 'enforceOrientation' | 'enableHybridVideo'>,
    Pick<DeviceRotation, 'alpha'>,
    Pick<
      FastMovementsDetectionHandle,
      'fastMovementsWarning' | 'onWarningDismiss' | 'resetDetection'
    > {
  /**
   * The ID of the inspection to add the video frames to.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkApiConfig;
  /**
   * The maximum number of retries for failed image uploads.
   */
  maxRetryCount: number;
  /**
   * The interval (in milliseconds) at which frames are selected and uploaded when `videoUploadStrategy` is set to
   * `VideoUploadStrategy.FIXED_UPLOAD_RATE`.
   */
  frameSelectionInterval: number;
  /**
   * Boolean indicating if the video is currently recording or not.
   */
  isRecording: boolean;
  /**
   * Callback called when setting the `isRecording` state.
   */
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  /**
   * The loading state for the start task feature.
   */
  startTasksLoading: LoadingState;
  /**
   * Callback called when the inspection capture is complete.
   */
  onComplete?: () => void;
  /**
   * Callback called when the user clicks on the close video button.
   */
  onCloseVideo?: () => void;
  /**
   * Boolean indicating if the close video button should be displayed in the HUD during the video recording.
   *
   * @default false
   */
  showCloseVideoButton?: boolean;
}

const SCREENSHOT_INTERVAL_MS = 100;

enum VideoCaptureHUDScreen {
  RECORDING = 'recording',
  COMPLETE = 'complete',
  PROCESSING = 'processing',
}

function getFastMovementsWarningMessage(type: FastMovementType | null): string {
  switch (type) {
    case FastMovementType.WALKING_TOO_FAST:
      return 'video.recording.fastMovementsDialog.walkingTooFast';
    case FastMovementType.PHONE_SHAKING:
      return 'video.recording.fastMovementsDialog.phoneShaking';
    default:
      return '';
  }
}

function getTooltipLabel(tooltip: VideoRecordingTooltip | null): string {
  switch (tooltip) {
    case VideoRecordingTooltip.START:
      return 'video.recording.tooltip.start';
    case VideoRecordingTooltip.END:
      return 'video.recording.tooltip.end';
    default:
      return '';
  }
}

/**
 * HUD component displayed on top of the camera preview for the VideoCapture process.
 */
export function VideoCaptureHUD({
  handle,
  cameraPreview,
  inspectionId,
  apiConfig,
  isRecording,
  setIsRecording,
  enforceOrientation,
  alpha,
  fastMovementsWarning,
  onWarningDismiss,
  resetDetection,
  maxRetryCount,
  frameSelectionInterval,
  minRecordingDuration,
  videoUploadStrategy,
  targetFramesCount,
  startTasksLoading,
  enableHybridVideo,
  onComplete,
  onCloseVideo,
  showCloseVideoButton,
}: VideoCaptureHUDProps) {
  const [screen, setScreen] = useState(VideoCaptureHUDScreen.RECORDING);
  const { t } = useTranslation();
  const { handleError } = useMonitoring();
  const isAdaptiveUploadRate = videoUploadStrategy === VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE;
  const { walkaroundPosition, startWalkaround, coveragePercentage, coveredSegments } =
    useVehicleWalkaround({
      alpha,
      isRecording,
    });
  const { addImage } = useMonkApi(apiConfig);

  const { uploadedFrames, totalUploadingFrames, onFrameSelected } = useVideoUploadQueue({
    apiConfig,
    inspectionId,
    maxRetryCount,
    alpha,
  });

  const { flushTrigger, capturedFramesCount, effectiveTargetFramesCount, startSegmentTracking } =
    useSegmentFrameSelection({
    walkaroundPosition,
    isRecording: isRecording && isAdaptiveUploadRate,
    targetFramesCount,
  });

  const { processedFrames, totalProcessingFrames, onCaptureVideoFrame } = useFrameSelection({
    handle,
    frameSelectionInterval,
    flushTrigger: isAdaptiveUploadRate ? flushTrigger : undefined,
    onFrameSelected,
  });

  const handleStartWalkaround = useCallback(() => {
    startWalkaround();
    startSegmentTracking();
  }, [startWalkaround, startSegmentTracking]);

  const {
    isRecordingPaused,
    onClickRecordVideo,
    onDiscardDialogKeepRecording,
    onDiscardDialogDiscardVideo,
    isDiscardDialogDisplayed,
    isMissingTargetFrames,
    recordingDurationMs,
    pauseRecording,
    resumeRecording,
    tooltip,
  } = useVideoRecording({
    isRecording,
    setIsRecording,
    screenshotInterval: SCREENSHOT_INTERVAL_MS,
    minRecordingDuration,
    enforceOrientation,
    coveragePercentage,
    videoUploadStrategy,
    capturedFramesCount,
    targetFramesCount: effectiveTargetFramesCount,
    startWalkaround: handleStartWalkaround,
    onCaptureVideoFrame,
    onRecordingComplete: () => {
      if (enableHybridVideo) {
        setScreen(VideoCaptureHUDScreen.COMPLETE);
      } else {
        setScreen(VideoCaptureHUDScreen.PROCESSING);
      }
    },
    resetFastMovementDetection: resetDetection,
  });

  const handleTakePictureClick = async () => {
    try {
      const picture = await handle.takePicture();
      await addImage({
        uploadType: ImageUploadType.VIDEO_MANUAL_PHOTO,
        inspectionId,
        picture,
      });
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (fastMovementsWarning) {
      pauseRecording();
    } else {
      resumeRecording();
    }
  }, [fastMovementsWarning, pauseRecording, resumeRecording]);

  return (
    <div style={styles['container']}>
      {cameraPreview}
      <div style={styles['hudContainer']}>
        {screen === VideoCaptureHUDScreen.RECORDING && (
          <VideoCaptureRecording
            walkaroundPosition={isRecording || isRecordingPaused ? walkaroundPosition : 0}
            isRecording={isRecording}
            isRecordingPaused={isRecordingPaused}
            coveredSegments={isRecording || isRecordingPaused ? coveredSegments : undefined}
            isComplete={
              isAdaptiveUploadRate
                ? capturedFramesCount >= effectiveTargetFramesCount
                : coveragePercentage >= MINIMUM_PERCENTAGE_VEHICLE_WALKAROUND_COVERAGE
            }
            recordingDurationMs={recordingDurationMs}
            onClickRecordVideo={onClickRecordVideo}
            onClickTakePicture={handleTakePictureClick}
            tooltip={tooltip ? t(getTooltipLabel(tooltip)) : undefined}
            recordVideoDisabled={handle.isLoading}
            onCloseVideo={onCloseVideo}
            showCloseVideoButton={showCloseVideoButton}
          />
        )}
        {screen === VideoCaptureHUDScreen.PROCESSING && (
          <VideoCaptureProcessing
            inspectionId={inspectionId}
            processedFrames={processedFrames}
            totalProcessingFrames={totalProcessingFrames}
            uploadedFrames={uploadedFrames}
            totalUploadingFrames={totalUploadingFrames}
            loading={startTasksLoading}
            onComplete={onComplete}
          />
        )}
        {screen === VideoCaptureHUDScreen.COMPLETE && (
          <VideoCaptureComplete onComplete={onComplete} />
        )}
      </div>
      <BackdropDialog
        show={isDiscardDialogDisplayed}
        message={t(
          isMissingTargetFrames
            ? 'video.recording.discardDialog.messageMissingFrames'
            : 'video.recording.discardDialog.message',
        )}
        confirmLabel={t('video.recording.discardDialog.keepRecording')}
        cancelLabel={t('video.recording.discardDialog.discardVideo')}
        onConfirm={onDiscardDialogKeepRecording}
        onCancel={onDiscardDialogDiscardVideo}
      />
      <BackdropDialog
        show={fastMovementsWarning !== null}
        message={t(getFastMovementsWarningMessage(fastMovementsWarning))}
        confirmLabel={t('video.recording.fastMovementsDialog.confirm')}
        onConfirm={onWarningDismiss}
        showCancelButton={false}
        dialogIcon='warning-outline'
        dialogIconPrimaryColor='caution'
      />
      <OrientationEnforcer orientation={enforceOrientation} />
    </div>
  );
}
