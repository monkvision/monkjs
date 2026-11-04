import { MileageUnit } from './state';

/**
 * How the confirmed OCR text is interpreted and what action is taken on confirmation.
 */
export enum OcrMode {
  /** Detected text is treated as a Vehicle Identification Number. */
  VIN = 'vin',
  /** Detected text is parsed as a mileage reading (integer value + optional unit). */
  ODOMETER = 'odometer',
}

/**
 * Pairs a sight with the OCR mode that should be active when that sight is selected.
 */
export interface OcrSightConfig {
  /** The sight ID that activates this OCR mode. */
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
