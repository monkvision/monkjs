import { useState } from 'react';
import { CameraHUDProps } from '@monkvision/camera-web';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { MonkApiConfig } from '@monkvision/network';
import { LoadingState } from '@monkvision/common';
import { styles } from './VideoCaptureHUD.styles';
import { VideoCaptureTutorial } from './VideoCaptureTutorial';
import { VideoCaptureRecording } from './VideoCaptureRecording';
import {
  useFrameSelection,
  useVehicleWalkaround,
  useVideoRecording,
  UseVideoRecordingParams,
  useVideoUploadQueue,
} from '../hooks';
import { VideoCaptureProcessing } from '../VideoCaptureProcessing';

/**
 * Props accepted by the VideoCaptureHUD component.
 */
export interface VideoCaptureHUDProps
  extends CameraHUDProps,
    Pick<UseVideoRecordingParams, 'minRecordingDuration'> {
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
   * The alpha value of the device orientaiton.
   */
  alpha: number;
  /**
   * The maximum number of retries for failed image uploads.
   */
  maxRetryCount: number;
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

/**
 * HUD component displayed on top of the camera preview for the VideoCapture process.
 */
export function VideoCaptureHUD({
  handle,
  cameraPreview,
  inspectionId,
  apiConfig,
  alpha,
  maxRetryCount,
  minRecordingDuration,
  startTasksLoading,
  onComplete,
}: VideoCaptureHUDProps) {
  const [screen, setScreen] = useState(VideoCaptureHUDScreen.TUTORIAL);
  const { t } = useTranslation();
  const { walkaroundPosition, startWalkaround } = useVehicleWalkaround({ alpha });

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
    isRecording,
    isRecordingPaused,
    onClickRecordVideo,
    onDiscardDialogKeepRecording,
    onDiscardDialogDiscardVideo,
    isDiscardDialogDisplayed,
    recordingDurationMs,
  } = useVideoRecording({
    screenshotInterval: SCREENSHOT_INTERVAL_MS,
    minRecordingDuration,
    walkaroundPosition,
    startWalkaround,
    onCaptureVideoFrame,
    onRecordingComplete: () => setScreen(VideoCaptureHUDScreen.PROCESSING),
  });

  const handleTakePictureClick = () => {};

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
    </div>
  );
}
