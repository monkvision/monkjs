import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CameraHUDProps } from '@monkvision/camera-web';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { ImageUploadType, MonkApiConfig, useMonkApi } from '@monkvision/network';
import { LoadingState } from '@monkvision/common';
import { DeviceRotation, VideoCaptureAppConfig } from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { styles } from './VideoCaptureHUD.styles';
import { VideoCaptureTutorial } from './VideoCaptureTutorial';
import { VideoCaptureRecording } from './VideoCaptureRecording';
import {
  FastMovementsDetectionHandle,
  FastMovementType,
  useFrameSelection,
  useVehicleWalkaround,
  useVideoRecording,
  UseVideoRecordingParams,
  useVideoUploadQueue,
} from '../hooks';
import { VideoCaptureProcessing } from '../VideoCaptureProcessing';
import { OrientationEnforcer } from '../../components';

/**
 * Props accepted by the VideoCaptureHUD component.
 */
export interface VideoCaptureHUDProps
  extends CameraHUDProps,
    Pick<UseVideoRecordingParams, 'minRecordingDuration'>,
    Pick<VideoCaptureAppConfig, 'enforceOrientation'>,
    Pick<DeviceRotation, 'alpha'>,
    Pick<FastMovementsDetectionHandle, 'fastMovementsWarning' | 'onWarningDismiss'> {
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
}

const SCREENSHOT_INTERVAL_MS = 200;
const FRAME_SELECTION_INTERVAL_MS = 1000;

enum VideoCaptureHUDScreen {
  TUTORIAL = 'tutorial',
  RECORDING = 'recording',
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
  maxRetryCount,
  minRecordingDuration,
  startTasksLoading,
  onComplete,
}: VideoCaptureHUDProps) {
  const [screen, setScreen] = useState(VideoCaptureHUDScreen.TUTORIAL);
  const { t } = useTranslation();
  const { handleError } = useMonitoring();
  const { walkaroundPosition, startWalkaround } = useVehicleWalkaround({ alpha });
  const { addImage } = useMonkApi(apiConfig);

  const { uploadedFrames, totalUploadingFrames, onFrameSelected } = useVideoUploadQueue({
    apiConfig,
    inspectionId,
    maxRetryCount,
  });

  const { processedFrames, totalProcessingFrames, onCaptureVideoFrame } = useFrameSelection({
    handle,
    frameSelectionInterval: FRAME_SELECTION_INTERVAL_MS,
    onFrameSelected,
  });
  const {
    isRecordingPaused,
    onClickRecordVideo,
    onDiscardDialogKeepRecording,
    onDiscardDialogDiscardVideo,
    isDiscardDialogDisplayed,
    recordingDurationMs,
    pauseRecording,
    resumeRecording,
  } = useVideoRecording({
    isRecording,
    setIsRecording,
    screenshotInterval: SCREENSHOT_INTERVAL_MS,
    minRecordingDuration,
    enforceOrientation,
    walkaroundPosition,
    startWalkaround,
    onCaptureVideoFrame,
    onRecordingComplete: () => setScreen(VideoCaptureHUDScreen.PROCESSING),
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
        {screen === VideoCaptureHUDScreen.TUTORIAL && (
          <VideoCaptureTutorial onClose={() => setScreen(VideoCaptureHUDScreen.RECORDING)} />
        )}
        {screen === VideoCaptureHUDScreen.RECORDING && (
          <VideoCaptureRecording
            walkaroundPosition={isRecording || isRecordingPaused ? walkaroundPosition : 0}
            isRecording={isRecording}
            isRecordingPaused={isRecordingPaused}
            recordingDurationMs={recordingDurationMs}
            onClickRecordVideo={onClickRecordVideo}
            onClickTakePicture={handleTakePictureClick}
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
      </div>
      <BackdropDialog
        show={isDiscardDialogDisplayed}
        message={t('video.recording.discardDialog.message')}
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
