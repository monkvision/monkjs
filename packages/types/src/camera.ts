/**
 * Interface describing the details of a picture taken and compressed by the Monk camera.
 */
export interface MonkPicture {
  /**
   * The Blob containing the picture data.
   */
  blob: Blob;
  /**
   * The DataURI of the picture, pointing to the local Blob object.
   */
  uri: string;
  /**
   * The mimetype (format) of the picture.
   */
  mimetype: string;
  /**
   * The width (in pixels) of the picture.
   */
  width: number;
  /**
   * The height (in pixels) of the picture.
   */
  height: number;
}

/**
 * Enumeration of the different compression format available for the Monk Camera
 */
export enum CompressionFormat {
  /**
   * Compression using the JPEG format.
   */
  JPEG = 'image/jpeg',
}

/**
 * Options used to specify the type of compression and encoding applied to the pictures taken by the Camera.
 */
export interface CompressionOptions {
  /**
   * The output format of the compression.
   *
   * @default CompressionFormat.JPEG
   */
  format: CompressionFormat;
  /**
   * Value indicating image quality for the compression output. This value goes from 1 (full quality, no loss) to 0
   * (very low quality). For compression formats that do not supported lossy compression, this option is ignored.
   *
   * @default 0.6
   */
  quality: number;
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
