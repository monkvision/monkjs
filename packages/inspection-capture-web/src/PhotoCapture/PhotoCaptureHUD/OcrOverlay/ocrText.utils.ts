import { MileageUnit } from '@monkvision/types';

export interface OdometerParseResult {
  /** Integer mileage value, or null if no digits were found. */
  value: number | null;
  /** Detected unit from the raw text, or null if none could be identified. */
  unit: MileageUnit | null;
}

/**
 * Parses a raw OCR string from an odometer reading.
 * - Keeps only the integer part (drops everything after a decimal point).
 * - Detects "km" → KM and "mi"/"miles" → MILES (case-insensitive).
 * - Strips all other non-numeric characters.
 */
const KM_RE = /km|kilo(?:met(?:er|re)s?)?/i;
// Covers: mi, mil, mile, miles — and common OCR confusions (ml, m1, mii)
const MILES_RE = /m(?:i|l|1){1,2}(?:l?e?s?)?(?!\p{L})/u;

export function parseOdometerText(raw: string): OdometerParseResult {
  let unit: MileageUnit | null = null;
  if (KM_RE.test(raw)) {
    unit = MileageUnit.KM;
  } else if (MILES_RE.test(raw)) {
    unit = MileageUnit.MILES;
  }

  const intStr = raw.replace(/[^0-9.]/g, '').split('.')[0];
  const parsed = intStr ? parseInt(intStr, 10) : NaN;

  return { value: Number.isNaN(parsed) ? null : parsed, unit };
}

/**
 * Formats a parsed odometer result as a human-readable string for display.
 * Example: { value: 123456, unit: MileageUnit.KM } → "123 456 km"
 */
export function formatOdometerDisplay({ value, unit }: OdometerParseResult): string {
  if (value === null) {
    return '—';
  }
  const formatted = value.toLocaleString('fr-FR'); // space-separated thousands
  return unit ? `${formatted} ${unit}` : formatted;
}
