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
   * @default 0.8
   */
  quality: number;
}
