/**
 * Props accepted by the VideoCaptureRecording component.
 */
export interface VideoCaptureRecordingProps {
  /**
   * The rotation of the user aroundn the vehicle in deg.
   */
  walkaroundPosition: number;
  /**
   * Boolean indicating if the video is currently recording or not.
   */
  isRecording: boolean;
  /**
   * Callback called when the user clicks on the record video button.
   */
  onClickRecordVideo?: () => void;
  /**
   * Callback called when the user clicks on the take picture button.
   */
  onClickTakePicture?: () => void;
}
