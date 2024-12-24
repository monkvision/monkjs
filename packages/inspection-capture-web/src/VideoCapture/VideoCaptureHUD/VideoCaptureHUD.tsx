import { useState } from 'react';
import { CameraHUDProps } from '@monkvision/camera-web';
import { useMonitoring } from '@monkvision/monitoring';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles } from './VideoCaptureHUD.styles';
import { VideoCaptureTutorial } from './VideoCaptureTutorial';
import { VideoCaptureRecording } from './VideoCaptureRecording';
import { useVehicleWalkaround, useVideoRecording, UseVideoRecordingParams } from '../hooks';

/**
 * Props accepted by the VideoCaptureHUD component.
 */
export interface VideoCaptureHUDProps
  extends CameraHUDProps,
    Pick<UseVideoRecordingParams, 'minRecordingDuration'> {
  /**
   * The alpha value of the device orientaiton.
   */
  alpha: number;
  /**
   * Callback called when the recording is complete.
   */
  onRecordingComplete?: () => void;
}

const SCREENSHOT_INTERVAL_MS = 1000;

/**
 * HUD component displayed on top of the camera preview for the VideoCapture process.
 */
export function VideoCaptureHUD({
  handle,
  cameraPreview,
  alpha,
  minRecordingDuration,
  onRecordingComplete,
}: VideoCaptureHUDProps) {
  const [isTutorialDisplayed, setIsTutorialDisplayed] = useState(true);
  const { t } = useTranslation();
  const { handleError } = useMonitoring();
  const { walkaroundPosition, startWalkaround } = useVehicleWalkaround({ alpha });

  const onCaptureVideoFrame = async () => {
    try {
      const picture = await handle.takePicture();
      console.log('Picture taken :', picture.blob.size);
    } catch (err) {
      handleError(err);
    }
  };

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
    onRecordingComplete,
  });

  const handleTakePictureClick = () => {};

  return (
    <div style={styles['container']}>
      {cameraPreview}
      <div style={styles['hudContainer']}>
        {isTutorialDisplayed ? (
          <VideoCaptureTutorial onClose={() => setIsTutorialDisplayed(false)} />
        ) : (
          <VideoCaptureRecording
            walkaroundPosition={isRecording || isRecordingPaused ? walkaroundPosition : 0}
            isRecording={isRecording}
            isRecordingPaused={isRecordingPaused}
            recordingDurationMs={recordingDurationMs}
            onClickRecordVideo={onClickRecordVideo}
            onClickTakePicture={handleTakePictureClick}
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
