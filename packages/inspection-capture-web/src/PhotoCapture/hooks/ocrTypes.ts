import { UseOcrConfig } from '@monkvision/ml-web';

export interface PhotoCaptureOcrConfig extends UseOcrConfig {
  /**
   * How often (in ms) to grab a frame from the camera and feed it to the OCR pipeline.
   * @default 600
   */
  captureIntervalMs?: number;
  /**
   * When true, rejecting a confirmed reading opens a manual text input instead of restarting
   * the OCR scan. The input is digit-only for odometer mode.
   * @default false
   */
  allowManualInput?: boolean;
  /**
   * Maximum number of times the user can reject an OCR reading before the shutter button is
   * unlocked so they can take a picture manually. After the limit is reached, OCR runs directly
   * on the captured picture.
   * @default 2
   */
  maxOcrRetries?: number;
  /**
   * Maximum time in milliseconds to wait for OCR to confirm a reading. After this duration the
   * shutter button is unlocked so the user can take a picture manually.
   * @default 20000
   */
  ocrTimeoutMs?: number;
}
