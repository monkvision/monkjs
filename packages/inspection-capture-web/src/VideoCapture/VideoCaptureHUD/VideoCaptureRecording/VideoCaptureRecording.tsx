import {
  RecordVideoButton,
  TakePictureButton,
  VehicleWalkaroundIndicator,
} from '@monkvision/common-ui-web';
import { useVideoCaptureRecordingStyles } from './VideoCaptureRecordingStyles';
import { VideoCaptureRecordingProps } from './VideoCaptureRecording.types';

function formatRecordingDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${totalMinutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

/**
 * HUD used in recording mode displayed on top of the camera in the VideoCaputre process.
 */
export function VideoCaptureRecording({
  walkaroundPosition,
  isRecording,
  isRecordingPaused,
  recordingDurationMs,
  onClickRecordVideo,
  onClickTakePicture,
  tooltip,
  recordVideoDisabled,
}: VideoCaptureRecordingProps) {
  const {
    container,
    indicators,
    recordingDuration,
    controls,
    takePictureFlash,
    walkaroundIndicator,
    showTakePictureFlash,
    tooltipPosition,
  } = useVideoCaptureRecordingStyles({ isRecording });

  const handleTakePictureClick = () => {
    showTakePictureFlash();
    onClickTakePicture?.();
  };

  return (
    <div style={container}>
      <div style={indicators}>
        {(isRecording || isRecordingPaused) && (
          <div style={recordingDuration}>{formatRecordingDuration(recordingDurationMs)}</div>
        )}
      </div>
      <div style={controls}>
        <div style={walkaroundIndicator} data-testid='walkaround-indicator-container'>
          <VehicleWalkaroundIndicator alpha={walkaroundPosition} />
        </div>
        <RecordVideoButton
          isRecording={isRecording}
          onClick={onClickRecordVideo}
          tooltip={tooltip}
          tooltipPosition={tooltipPosition}
          disabled={recordVideoDisabled}
        />
        <TakePictureButton onClick={handleTakePictureClick} disabled={!isRecording} />
      </div>
      <div style={takePictureFlash} />
    </div>
  );
}
