import { useState } from 'react';
import { CameraHUDProps } from '@monkvision/camera-web';
import { styles } from './VideoCaptureHUD.styles';
import { VideoCaptureTutorial } from './VideoCaptureTutorial';
import { VideoCaptureRecording } from './VideoCaptureRecording';
import { useVehicleWalkaround } from '../hooks';

/**
 * Props accepted by the VideoCaptureHUD component.
 */
export interface VideoCaptureHUDProps extends CameraHUDProps {
  /**
   * The alpha value of the device orientaiton.
   */
  alpha: number;
}

/**
 * HUD component displayed on top of the camera preview for the VideoCapture process.
 */
export function VideoCaptureHUD({ handle, cameraPreview, alpha }: VideoCaptureHUDProps) {
  const [isTutorialDisplayed, setIsTutorialDisplayed] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { walkaroundPosition, startWalkaround } = useVehicleWalkaround({ alpha });

  const onClickRecordVideo = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      startWalkaround();
      setIsRecording(true);
    }
  };

  const onClickTakePicture = () => {};

  return (
    <div style={styles['container']}>
      {cameraPreview}
      <div style={styles['hudContainer']}>
        {isTutorialDisplayed ? (
          <VideoCaptureTutorial onClose={() => setIsTutorialDisplayed(false)} />
        ) : (
          <VideoCaptureRecording
            walkaroundPosition={isRecording ? walkaroundPosition : 0}
            isRecording={isRecording}
            onClickRecordVideo={onClickRecordVideo}
            onClickTakePicture={onClickTakePicture}
          />
        )}
      </div>
    </div>
  );
}
