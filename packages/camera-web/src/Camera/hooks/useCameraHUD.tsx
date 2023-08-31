import { ComponentType, ReactElement, useMemo } from 'react';
import { UserMediaError } from './useUserMedia';

/**
 * A set of properties used to handle a Camera preview.
 */
export interface CameraHandle {
  /**
   * A function that you can call to ask the camera to take a picture.
   */
  takePicture: () => ImageData;
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
  onPictureTaken?: (picture: ImageData) => void;
}

/**
 * Props accepted by a CameraHUD component.
 */
export interface CameraHUDProps extends CameraEventHandlers {
  handle?: Partial<CameraHandle>;
}

/**
 * Component type definition for a Camera HUD component.
 */
export type CameraHUDComponent = ComponentType<CameraHUDProps>;

export type CameraHUDElement = ReactElement<CameraHUDProps>;

export interface UseCameraHUDParams {
  handle: CameraHandle;
  component?: CameraHUDComponent;
  eventHandlers?: CameraEventHandlers;
}

export function useCameraHUD({
  handle,
  component,
  eventHandlers = {},
}: UseCameraHUDParams): CameraHUDElement | null {
  const HUDComponent = component;
  return useMemo(
    () => (HUDComponent ? <HUDComponent handle={handle} {...eventHandlers} /> : null),
    [component, handle, eventHandlers],
  );
}
