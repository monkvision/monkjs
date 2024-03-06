import { getCameraErrorLabel, UserMediaErrorType } from '../../src';

describe('Camera error utils', () => {
  describe('getCameraErrorLabel util function', () => {
    it('should return an error label for each error type', () => {
      Object.values(UserMediaErrorType).forEach((type) => {
        expect(getCameraErrorLabel(type)).toEqual({
          en: expect.any(String),
          fr: expect.any(String),
          de: expect.any(String),
        });
      });
    });

    it('should return an error label for unknown error types', () => {
      expect(getCameraErrorLabel('test' as UserMediaErrorType)).toEqual({
        en: expect.any(String),
        fr: expect.any(String),
        de: expect.any(String),
      });
    });

    it('should return an error label even when provided nothing', () => {
      expect(getCameraErrorLabel()).toEqual({
        en: expect.any(String),
        fr: expect.any(String),
        de: expect.any(String),
      });
    });
  });
});
