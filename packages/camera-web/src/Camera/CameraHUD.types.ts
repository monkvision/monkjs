import { CapturedPicture } from './Camera.types';

/**
 * Handle object passed to the Camera HUD component, giving it access to camera controls.
 */
export interface CameraHandle {
  /** Take a picture. Returns null if the frame is too blurry or capture fails. */
  takePicture: () => Promise<CapturedPicture | null>;
  /** True while a picture is being processed */
  isLoading: boolean;
  /** True when the current camera frame is too blurry to capture */
  isBlurry: boolean;
}

export interface CameraHUDProps {
  handle: CameraHandle;
}
