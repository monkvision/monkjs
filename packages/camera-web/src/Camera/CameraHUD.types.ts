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
  takePicture: () => Promise<MonkPicture>;
  /**
   * A function that you can call to get the current raw image data displayed on the camera stream. You can use this
   * function if you need to apply a custom procesing to the image pixels and don't want the automatic compression logic
   * of the Camera component. You can use the `handle.compressImage` method to compress the raw image data using the
   * Camera component's compression configuration. If you just want to take a picture normally, use the
   * `handle.takePicture` method.
   *
   * Note: This method does NOT use any monitoring tracking. The only way to enable monitoring is by taking pictures via
   * the `handle.takePicture` method.
   */
  getImageData: () => ImageData;
  /**
   * A function that you can call to compress a raw ImageData (taken using the `handle.compressImage` function) into a
   * MonkPicture object. This function will use the compression options passed as parameters to the Camera component.
   *
   * Note: This method does NOT use any monitoring tracking. The only way to enable monitoring is by taking pictures via
   * the `handle.takePicture` method.
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
   * A function to retry the camera stream fetching in case of error.
   */
  retry: () => void;
  /**
   * The dimensions of the resulting camera stream. Note that these dimensions can differ from the ones given in the
   * stream constraints if they are not supported or available on the current device.
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
