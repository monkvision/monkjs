import { BasicValidationErrors, email, mergeValidationFunctions, required } from '../../src';

describe('Form Validation utils', () => {
  describe('mergeValidationFunctions function', () => {
    it('should properly merge multiple validation functions', () => {
      const result = mergeValidationFunctions(
        (value: string) => (value.length < 1 ? 'too-short' : null),
        (value: string) => (value.length > 3 ? 'too-long' : null),
      );

      expect(result('')).toEqual('too-short');
      expect(result('abcd')).toEqual('too-long');
      expect(result('abc')).toBe(null);
    });
  });

  describe('required function', () => {
    it('should return an error if the value is not defined', () => {
      expect(required(null)).toEqual(BasicValidationErrors.REQUIRED);
      expect(required(undefined)).toEqual(BasicValidationErrors.REQUIRED);
      expect(required('')).toEqual(BasicValidationErrors.REQUIRED);
    });

    it('should null if the value is defined', () => {
      expect(required(12)).toBe(null);
      expect(required('dwqdqw')).toBe(null);
    });
  });

  describe('email function', () => {
    it('should return an error if the value is not defined', () => {
      expect(email(null)).toEqual(BasicValidationErrors.REQUIRED);
      expect(email(undefined)).toEqual(BasicValidationErrors.REQUIRED);
      expect(email('')).toEqual(BasicValidationErrors.REQUIRED);
    });

    it('should an error if the value is not a valid email', () => {
      expect(email(12)).toEqual(BasicValidationErrors.EMAIL_NOT_VALID);
      expect(email('dwqdqw')).toEqual(BasicValidationErrors.EMAIL_NOT_VALID);
      expect(email('test@mail.c')).toEqual(BasicValidationErrors.EMAIL_NOT_VALID);
    });

    it('should null if the value is a valid email', () => {
      expect(email('test@acvauctions.com')).toBe(null);
    });
  });
});
