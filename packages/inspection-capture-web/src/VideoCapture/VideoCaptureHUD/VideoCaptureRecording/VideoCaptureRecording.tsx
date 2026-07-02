import { Button, RecordVideoButton, VehicleWalkaroundIndicator } from '@monkvision/common-ui-web';
import { MonkTestId } from '@monkvision/types';
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
  coveredSegments,
  isComplete,
  recordingDurationMs,
  onClickRecordVideo,
  tooltip,
  recordVideoDisabled,
  onCloseVideo,
  showCloseVideoButton,
}: VideoCaptureRecordingProps) {
  const {
    container,
    indicators,
    recordingDuration,
    controls,
    takePictureFlash,
    walkaroundIndicator,
    tooltipPosition,
    closeButton,
  } = useVideoCaptureRecordingStyles({ isRecording, showCloseVideoButton });

  return (
    <div style={container}>
      <div style={indicators}>
        {(isRecording || isRecordingPaused) && (
          <div style={recordingDuration}>{formatRecordingDuration(recordingDurationMs)}</div>
        )}
      </div>
      <div style={controls}>
        <div style={walkaroundIndicator} data-testid={MonkTestId.WALKAROUND_INDICATOR_CONTAINER}>
          <VehicleWalkaroundIndicator
            alpha={walkaroundPosition}
            coveredSegments={coveredSegments}
            showCompletionIcon={isComplete}
          />
        </div>
        <RecordVideoButton
          isRecording={isRecording}
          onClick={onClickRecordVideo}
          tooltip={tooltip}
          tooltipPosition={tooltipPosition}
          disabled={recordVideoDisabled}
        />

        <Button
          icon='close'
          variant='outline'
          onClick={onCloseVideo}
          data-testid='close-video-button'
          style={closeButton}
        />
      </div>
      <div style={takePictureFlash} />
    </div>
  );
}
