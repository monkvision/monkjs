import { ComponentType, ReactElement } from 'react';
import { PixelDimensions, MonkPicture } from '@monkvision/types';
import { UserMediaError } from './hooks';

/**
 * A set of properties used to handle a Camera preview.
 */
export interface CameraHandle {
  /**
   * A function that you can call to ask the camera to take a picture.
   */
  takePicture: () => MonkPicture;
  /**
   * The error details if there has been an error when fetching the camera stream.
   */
  error: UserMediaError | null;
  /**
   * Boolean indicating if the camera preview is loading.
   */
  isLoading: boolean;
  /**
   * A function to retry the camera stream fetching in case of error.
   */
  retry: () => void;
  /**
   * The dimensions of the resulting camera stream. Note that these dimensions can differ from the ones given in the
   * stream constraints if they are not supported or available on the current device.
   */
  dimensions: PixelDimensions | null;
}

/**
 * Interface describing the different event handlers for events dispatched by the Camera component.
 */
export interface CameraEventHandlers {
  /**
   * Callback called when a picture has been taken by the Camera.
   *
   * @param picture The picture that has been taken.
   */
  onPictureTaken?: (picture: MonkPicture) => void;
}

/**
 * Props accepted by a CameraHUD component.
 */
export interface CameraHUDProps {
  /**
   * The camera preview element. The HUD component is expected to take this element as a prop and display it however it
   * wants to.
   */
  cameraPreview: ReactElement;
  /**
   * The handle used to control the camera.
   */
  handle: CameraHandle;
}

/**
 * Component type definition for a Camera HUD component.
 */
export type CameraHUDComponent<T extends object = Record<never, never>> = ComponentType<
  CameraHUDProps & T
>;
