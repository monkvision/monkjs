import {
  RecordVideoButton,
  TakePictureButton,
  VehicleWalkaroundIndicator,
} from '@monkvision/common-ui-web';
import { useVideoCaptureRecordingStyles } from './VideoCaptureRecordingStyles';
import { VideoCaptureRecordingProps } from './VideoCaptureRecording.types';

/**
 * HUD used in recording mode displayed on top of the camera in the VideoCaputre process.
 */
export function VideoCaptureRecording({
  walkaroundPosition,
  isRecording,
  onClickRecordVideo,
  onClickTakePicture,
}: VideoCaptureRecordingProps) {
  const { container, controls, takePictureFlash, walkaroundIndicator, showTakePictureFlash } =
    useVideoCaptureRecordingStyles({ isRecording });

  const handleTakePictureClick = () => {
    showTakePictureFlash();
    onClickTakePicture?.();
  };

  return (
    <div style={container}>
      <div style={controls}>
        <div style={walkaroundIndicator} data-testid='walkaround-indicator-container'>
          <VehicleWalkaroundIndicator alpha={walkaroundPosition} />
        </div>
        <RecordVideoButton isRecording={isRecording} onClick={onClickRecordVideo} />
        <TakePictureButton onClick={handleTakePictureClick} disabled={!isRecording} />
      </div>
      <div style={takePictureFlash} />
    </div>
  );
}
