import { useState } from 'react';
import { CameraHUDProps } from '@monkvision/camera-web';
import { styles } from './VideoCaptureHUD.styles';
import { VideoCaptureTutorial } from './VideoCaptureTutorial';

/**
 * Props accepted by the VideoCaptureHUD component.
 */
export interface VideoCaptureHUDProps extends CameraHUDProps {}

/**
 * HUD component displayed on top of the camera preview for the VideoCapture process.
 */
export function VideoCaptureHUD({ handle, cameraPreview }: VideoCaptureHUDProps) {
  const [isTutorialDisplayed, setIsTutorialDisplayed] = useState(true);

  return (
    <div style={styles['container']}>
      {cameraPreview}
      <div style={styles['hudContainer']}>
        {isTutorialDisplayed ? (
          <VideoCaptureTutorial onClose={() => setIsTutorialDisplayed(false)} />
        ) : (
          <button onClick={handle.takePicture}>Take Picture</button>
        )}
      </div>
    </div>
  );
}
