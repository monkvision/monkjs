import { LoadingState } from '@monkvision/common';

/**
 * Props accepted by the VideoCaptureProcessing component.
 */
export interface VideoCaptureProcessingProps {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The number of frames that have successfully been processed and added to the upload queue.
   */
  processedFrames: number;
  /**
   * The total number of frames added to the processing queue.
   */
  totalProcessingFrames: number;
  /**
   * The number of frames that have successfully been uploaded to the API.
   */
  uploadedFrames: number;
  /**
   * The total number of frames added to the uploading queue.
   */
  totalUploadingFrames: number;
  /**
   * Loading state for the done button.
   */
  loading: LoadingState;
  /**
   * Callback called when the user presses the confirm button.
   */
  onComplete?: () => void;
}
