import { ImageCompression } from '@monkvision/types';

/**
 * Handle exposed by the Camera component to HUD children via the render-prop pattern.
 * Provides camera controls and state that HUD elements can react to.
 */
export interface CameraHandle {
  /** Take a picture. Blocked automatically if the current frame is too blurry. */
  takePicture: () => Promise<void>;
  /** Whether a picture is currently being processed. */
  isLoading: boolean;
  /**
   * Whether the last capture attempt was blocked because the frame was blurry.
   * HUD components should surface a "Hold still" indicator when this is true.
   */
  isBlurry: boolean;
  /** The last picture taken, or null if none yet. */
  lastPicture: ImageCompression | null;
}
