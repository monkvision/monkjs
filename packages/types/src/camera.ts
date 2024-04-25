/**
 * Interface describing the details of a picture taken and compressed by the Monk camera.
 */
export interface MonkPicture {
  /**
   * The DataURI of the picture.
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
