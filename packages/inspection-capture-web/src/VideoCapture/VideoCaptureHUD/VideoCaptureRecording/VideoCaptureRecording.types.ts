/**
 * Represents a covered segment of the walkaround (in degrees).
 */
export interface CoveredSegment {
  /**
   * Start angle in degrees (0-360).
   */
  start: number;
  /**
   * End angle in degrees (0-360).
   */
  end: number;
}

/**
 * Props accepted by the VideoCaptureRecording component.
 */
export interface VideoCaptureRecordingProps {
  /**
   * The rotation of the user aroundn the vehicle in deg.
   */
  walkaroundPosition: number;
  /**
   * Array of covered segments around the vehicle.
   */
  coveredSegments?: CoveredSegment[];
  /**
   * Boolean indicating if the video is currently recording or not.
   */
  isRecording: boolean;
  /**
   * Boolean indicating if the video recording is paused or not.
   */
  isRecordingPaused: boolean;
  /**
   * The total duration (in milliseconds) of the current video recording.
   */
  recordingDurationMs: number;
  /**
   * Boolean indicating if the record video button should be disabled or not.
   */
  recordVideoDisabled: boolean;
  /**
   * Callback called when the user clicks on the record video button.
   */
  onClickRecordVideo?: () => void;
  /**
   * Callback called when the user clicks on the take picture button.
   */
  onClickTakePicture?: () => void;
  /**
   * The tooltip to display on top of the recording button.
   */
  tooltip?: string;
}
