import { MileageUnit } from '@monkvision/types';
import {
  parseOdometerText,
  formatOdometerDisplay,
} from '../../../../src/PhotoCapture/PhotoCaptureHUD/OcrOverlay/PhotoCaptureHUDOcrText.utils';

describe('parseOdometerText', () => {
  it('returns null values for an empty string', () => {
    expect(parseOdometerText('')).toEqual({ value: null, unit: null });
  });

  it('returns the integer value with no unit for plain digits', () => {
    expect(parseOdometerText('123456')).toEqual({ value: 123456, unit: null });
  });

  it('detects the km unit', () => {
    expect(parseOdometerText('50000 km')).toEqual({ value: 50000, unit: MileageUnit.KM });
  });

  it('detects the kilometer(s) unit variant', () => {
    expect(parseOdometerText('100 kilometers')).toEqual({ value: 100, unit: MileageUnit.KM });
  });

  it('detects the miles unit', () => {
    expect(parseOdometerText('12345 miles')).toEqual({ value: 12345, unit: MileageUnit.MILES });
  });

  it('detects the mi unit variant', () => {
    expect(parseOdometerText('9999 mi')).toEqual({ value: 9999, unit: MileageUnit.MILES });
  });

  it('takes only the integer part of a decimal number', () => {
    expect(parseOdometerText('123.456')).toEqual({ value: 123, unit: null });
  });

  it('returns null value when no digits are present', () => {
    expect(parseOdometerText('no digits here')).toEqual({ value: null, unit: null });
  });

  it('returns null value when value exceeds 1_000_000', () => {
    expect(parseOdometerText('1000001')).toEqual({ value: null, unit: null });
  });

  it('accepts exactly 1_000_000 as a valid boundary value', () => {
    expect(parseOdometerText('1000000')).toEqual({ value: 1000000, unit: null });
  });

  it('accepts 0 as a valid value', () => {
    expect(parseOdometerText('0 km')).toEqual({ value: 0, unit: MileageUnit.KM });
  });

  it('treats space-separated digit groups as a single number (spaces stripped before parsing)', () => {
    expect(parseOdometerText('50 000')).toEqual({ value: 50000, unit: null });
  });
});

describe('formatOdometerDisplay', () => {
  it('returns the dash placeholder for a null value', () => {
    expect(formatOdometerDisplay({ value: null, unit: null })).toBe('—');
  });

  it('appends the km unit when present', () => {
    const result = formatOdometerDisplay({ value: 50000, unit: MileageUnit.KM });
    expect(result).toContain('km');
    expect(result).toContain('50');
  });

  it('appends the miles unit when present', () => {
    const result = formatOdometerDisplay({ value: 25000, unit: MileageUnit.MILES });
    expect(result).toContain('miles');
  });

  it('formats a value with no unit without appending a unit label', () => {
    const result = formatOdometerDisplay({ value: 1000, unit: null });
    expect(result).not.toContain('km');
    expect(result).not.toContain('miles');
    expect(result).toContain('1');
  });

  it('formats 0 without the dash placeholder', () => {
    expect(formatOdometerDisplay({ value: 0, unit: null })).not.toBe('—');
  });
});
