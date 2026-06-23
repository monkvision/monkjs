import { ComponentType, ReactElement } from 'react';
import { PixelDimensions, MonkPicture } from '@monkvision/types';
import { UserMediaError } from './hooks';

/**
 * A set of properties used to handle a Camera preview.
 */
export interface CameraHandle {
  /**
   * A function that you can call to ask the camera to take a picture.
   * When the blur gate is active and the frame is too blurry, the function returns
   * without calling onPictureTaken. Watch `isBlurry` to show a 'Hold still' indicator.
   */
  takePicture: () => Promise<MonkPicture>;
  /**
   * A function that you can call to get the current raw image data displayed on the camera stream.
   */
  getImageData: () => ImageData;
  /**
   * A function that you can call to compress a raw ImageData into a MonkPicture object.
   */
  compressImage: (image: ImageData) => Promise<MonkPicture>;
  /**
   * The error details if there has been an error when fetching the camera stream.
   */
  error: UserMediaError | null;
  /**
   * Boolean indicating if the camera preview is loading.
   */
  isLoading: boolean;
  /**
   * True when the current camera frame is too blurry to capture.
   * Use this in your HUD to show a 'Hold still' indicator to the user.
   */
  isBlurry: boolean;
  /**
   * A function to retry the camera stream fetching in case of error.
   */
  retry: () => void;
  /**
   * The dimensions of the resulting camera stream.
   */
  dimensions: PixelDimensions | null;
  /**
   * The effective pixel dimensions of the video stream on the client screen.
   */
  previewDimensions: PixelDimensions | null;
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
   * The camera preview element.
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
