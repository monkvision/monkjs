import { UseOcrConfig } from '@monkvision/ml-web';
import { MileageUnit } from '@monkvision/types';

/**
 * How the confirmed OCR text is interpreted and what action is taken on confirmation.
 * - `'vin'`: detected text is treated as a Vehicle Identification Number.
 * - `'odometer'`: detected text is parsed as a mileage reading (integer value + optional unit).
 */
export type OcrMode = 'vin' | 'odometer';

/**
 * Pairs a sight with the OCR mode that should be active when that sight is selected.
 */
export interface OcrSightConfig {
  /**
   * The sight ID that activates this OCR mode.
   */
  sightId: string;
  /**
   * How the confirmed OCR text is interpreted on this sight.
   * @see OcrMode
   */
  mode: OcrMode;
  /**
   * Fallback mileage unit used when OCR cannot detect one from the text (odometer mode only).
   * Without this, the unit defaults to KM when undetected.
   */
  defaultMileageUnit?: MileageUnit;
}

export interface PhotoCaptureOcrConfig extends Omit<UseOcrConfig, 'workerUrl'> {
  /**
   * URL of the compiled Web Worker script. Defaults to `OCR_WORKER_URL` from `@monkvision/ml-web`
   * when not provided.
   */
  workerUrl?: string;
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
   * @default 30000
   */
  ocrTimeoutMs?: number;
}

