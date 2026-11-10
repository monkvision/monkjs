import { MileageUnit } from '@monkvision/types';

export interface OdometerParseResult {
  /** Integer mileage value, or null if no digits were found. */
  value: number | null;
  /** Detected unit from the raw text, or null if none could be identified. */
  unit: MileageUnit | null;
}

const KM_RE = /km|kilo(?:met(?:er|re)s?)?/i;
const MILES_RE = /m(?:i|l|1){1,2}(?:l?e?s?)?(?!\p{L})/u;

/** Extracts the mileage value and unit from a raw odometer OCR string. */
export function parseOdometerText(raw: string): OdometerParseResult {
  let unit: MileageUnit | null = null;
  if (KM_RE.test(raw)) {
    unit = MileageUnit.KM;
  } else if (MILES_RE.test(raw)) {
    unit = MileageUnit.MILES;
  }

  const digits = raw
    .replace(/\s/g, '')
    .replace(/[.,]\d{1,2}(?=\D|$)/g, '')
    .replace(/\D/g, '');
  const parsed = digits ? parseInt(digits, 10) : NaN;
  const value = Number.isNaN(parsed) || parsed < 0 || parsed > 1_000_000 ? null : parsed;

  return { value, unit };
}
