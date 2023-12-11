import { ComponentType, ReactElement } from 'react';
import { MonkPicture, UserMediaError } from './hooks';

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
   * The camera preview element. The HUD component is exepcted to take this element as a prop and display it however it
   * wants to.
   */
  cameraPreview: ReactElement;
  /**
   * The handle used to control the camera.
   */
  handle?: Partial<CameraHandle>;
}

/**
 * Component type definition for a Camera HUD component.
 */
export type CameraHUDComponent = ComponentType<CameraHUDProps>;

/**
 * Element type definition for a Camera HUD component.
 */
export type CameraHUDElement = ReactElement<CameraHUDProps>;

/**
 * Parameters passed to the useCameraHUD hook.
 */
export interface UseCameraHUDParams {
  /**
   * The camera handle used to control the camera.
   */
  handle: CameraHandle;
  /**
   * The preview of the camera as a React element.
   */
  cameraPreview: ReactElement;
  /**
   * The camera HUD component.
   */
  component?: CameraHUDComponent;
}
