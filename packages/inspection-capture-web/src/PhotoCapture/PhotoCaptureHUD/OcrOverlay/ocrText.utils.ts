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
export function parseOdometerText(raw: string): OdometerParseResult {
  const lower = raw.toLowerCase().replace(/\s/g, '');

  let unit: MileageUnit | null = null;
  if (lower.includes('km')) {
    unit = MileageUnit.KM;
  } else if (lower.includes('mi')) {
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
