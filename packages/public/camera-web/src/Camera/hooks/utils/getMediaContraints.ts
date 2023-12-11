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

/**
 * Enumeration of the 16:9 resolutions that can be used to specify the constraints of a video stream fetched by the
 * Monk camera.
 *
 * ***Important Note : Lower quality resolutions should only be used for testing, as AI models can have a hard time
 * detecting damages on lower res pictures.***
 */
export enum CameraResolution {
  /**
   * QnHD quality (180p) : 320x180 pixels.
   *
   * *Note : This quality is to be used for testing purposes only.*
   */
  QNHD_180P = '180p',
  /**
   * nHD quality (360p) : 640x360 pixels.
   *
   * *Note : This quality is to be used for testing purposes only.*
   */
  NHD_360P = '360p',
  /**
   * HD quality (720p) : 1280x720 pixels.
   */
  HD_720P = '720p',
  /**
   * FHD quality (1080p) : 1920x1080 pixels.
   */
  FHD_1080P = '1080p',
  /**
   * QHD quality (2K) : 2560x1440 pixels.
   */
  QHD_2K = '2K',
  /**
   * UHD quality (4K) : 3840x2160 pixels.
   */
  UHD_4K = '4K',
}

const CAMERA_RESOLUTION_SIZES: {
  [key in CameraResolution]: { width: number; height: number };
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
   *
   * @default `CameraFacingMode.ENVIRONMENT`
   */
  facingMode: CameraFacingMode;
  /**
   * Resolution quality for the camera. If no camera on the device meets the requirements, the closest match will be
   * used. Notes :
   * - The Monk Camera package will always try to fetch a stream with a 16:9 resolution format.
   * - The implementation of the algorithm used to choose the closest camera can differ between browsers, and if the
   * exact requirements can't be met, the resulting stream's quality can differ between browsers.
   *
   * @default `CameraResolution.UHD_4K`
   */
  resolution: CameraResolution;
  /**
   * The ID of the camera device to use. This ID can be fetched using the native
   * `navigator.mediaDevices?.enumerateDevices` function. If this ID is specified, it will prevail over the `facingMode`
   * property.
   */
  deviceId?: string;
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
  const { width, height } = CAMERA_RESOLUTION_SIZES[config.resolution];

  const video: MediaTrackConstraints = {
    width: { ideal: width },
    height: { ideal: height },
    facingMode: config.facingMode,
  };

  if (config.deviceId) {
    video.deviceId = config.deviceId;
  }

  return {
    audio: false,
    video,
  };
}
