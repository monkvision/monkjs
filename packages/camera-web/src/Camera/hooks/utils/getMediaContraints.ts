import { CameraResolution, PixelDimensions } from '@monkvision/types';

/**
 * Enumeration of the facing modes for the camera constraints.
 */
export enum CameraFacingMode {
  /**
   * User-facing camera (front camera).
   */
  USER = 'user',
  /**
   * Enironment-facing camera (back camera).
   */
  ENVIRONMENT = 'environment',
}

const CAMERA_RESOLUTION_DIMENSIONS: {
  [key in CameraResolution]: PixelDimensions;
} = {
  [CameraResolution.QNHD_180P]: { width: 320, height: 180 },
  [CameraResolution.NHD_360P]: { width: 640, height: 360 },
  [CameraResolution.HD_720P]: { width: 1280, height: 720 },
  [CameraResolution.FHD_1080P]: { width: 1920, height: 1080 },
  [CameraResolution.QHD_2K]: { width: 2560, height: 1440 },
  [CameraResolution.UHD_4K]: { width: 3840, height: 2160 },
};

/**
 * Specifications for the camera stream that the Monk `Camera` component should fetch from the device.
 */
export interface CameraConfig {
  /**
   * Specifies which camera to use if the devices has a front and a rear camera. If the device does not have a camera
   * meeting the requirements, the closest one will be used.
   */
  facingMode: CameraFacingMode;
  /**
   * Resolution quality for the camera. If no camera on the device meets the requirements, the closest match will be
   * used. Notes :
   * - The Monk Camera package will always try to fetch a stream with a 16:9 resolution format.
   * - The implementation of the algorithm used to choose the closest camera can differ between browsers, and if the
   * exact requirements can't be met, the resulting stream's quality can differ between browsers.
   */
  resolution: CameraResolution;
}

/**
 * Utility function that returns the dimensions in pixels of the given `CameraResolution`.
 */
export function getResolutionDimensions(
  resolution: CameraResolution,
  isPortrait = false,
): PixelDimensions {
  const dimensions = CAMERA_RESOLUTION_DIMENSIONS[resolution];
  return {
    width: isPortrait ? dimensions.height : dimensions.width,
    height: isPortrait ? dimensions.width : dimensions.height,
  };
}

/**
 * This function is used by the Monk Camera package in order to add a layer of abstraction to the media constraints
 * passed to the `useUserMedia` hook. It takes an optional `CameraOptions` parameter and creates a
 * `MediaStreamConstraints` corresponding to the given options. The default option for each `CameraOptions` field can be
 * found in their respsective tsdoc descriptions, refer to the `CameraOptions` interface for more details.
 *
 * @see CameraConfig
 * @see useUserMedia
 */
export function getMediaConstraints(config: CameraConfig): MediaStreamConstraints {
  const { width, height } = getResolutionDimensions(config.resolution);

  const video: MediaTrackConstraints = {
    width: { ideal: width },
    height: { ideal: height },
    facingMode: config.facingMode,
  };

  return {
    audio: false,
    video,
  };
}
