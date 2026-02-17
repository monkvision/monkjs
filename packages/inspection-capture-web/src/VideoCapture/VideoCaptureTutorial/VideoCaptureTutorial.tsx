import { VideoTutorial } from '@monkvision/common-ui-web';
import { DeviceOrientation } from '@monkvision/types';
import { VideoCapturePageLayout } from '../VideoCapturePageLayout';

/**
 * Props accepted by the VideoCaptureTutorial component.
 */
export interface VideoCaptureTutorialProps {
  /**
   * Callback called when the user closes the tutorial by clicking on the confirm button.
   */
  onClose?: () => void;
  /**
   * Use this prop to enforce a specific device orientation for the Camera screen.
   */
  enforceOrientation?: DeviceOrientation;
}

/**
 * This component is a tutorial displayed on top of the camera when the user first starts the video capture.
 */
export function VideoCaptureTutorial({ onClose, enforceOrientation }: VideoCaptureTutorialProps) {
  return (
    <VideoCapturePageLayout
      showLogo={false}
      showTitle={false}
      showBackdrop={true}
      showConfirmButton={false}
    >
      <VideoTutorial orientation={enforceOrientation} onComplete={onClose} />
    </VideoCapturePageLayout>
  );
}
