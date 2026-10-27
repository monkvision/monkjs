import { isInternalServerError, isNetworkError, isTimeoutError } from '../../src';

describe('Request utils', () => {
  describe('isNetworkError function', () => {
    it('should return true for Chrome, Safari and Firefox network errors', () => {
      expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true);
      expect(isNetworkError(new TypeError('Load failed'))).toBe(true);
      expect(isNetworkError(new TypeError('NetworkError when attempting to fetch resource.'))).toBe(
        true,
      );
    });

    it('should return false for HTTP errors and other values', () => {
      const httpError = Object.assign(new Error('Failed to fetch'), { response: { status: 500 } });
      expect(isNetworkError(httpError)).toBe(false);
      expect(isNetworkError(new Error('Something went wrong'))).toBe(false);
      expect(isNetworkError(null)).toBe(false);
      expect(isNetworkError('Failed to fetch')).toBe(false);
    });
  });

  describe('isTimeoutError function', () => {
    it('should return true for a TimeoutError', () => {
      const err = new Error('test');
      err.name = 'TimeoutError';
      expect(isTimeoutError(err)).toBe(true);
    });

    it('should return true for a "Failed to fetch" error', () => {
      expect(isTimeoutError(new Error('Failed to fetch'))).toBe(true);
    });

    it('should return true for Safari and Firefox network errors', () => {
      expect(isTimeoutError(new TypeError('Load failed'))).toBe(true);
      expect(isTimeoutError(new TypeError('NetworkError when attempting to fetch resource.'))).toBe(
        true,
      );
    });

    it('should return false for other errors', () => {
      expect(isTimeoutError(new Error('Something went wrong'))).toBe(false);
      expect(isTimeoutError({ response: { status: 500 } })).toBe(false);
      expect(isTimeoutError(null)).toBe(false);
      expect(isTimeoutError(undefined)).toBe(false);
      expect(isTimeoutError('string error')).toBe(false);
    });
  });

  describe('isInternalServerError function', () => {
    it('should return true for 5xx HTTP errors', () => {
      expect(isInternalServerError({ response: { status: 500 } })).toBe(true);
      expect(isInternalServerError({ response: { status: 502 } })).toBe(true);
      expect(isInternalServerError({ response: { status: 503 } })).toBe(true);
      expect(isInternalServerError({ response: { status: 599 } })).toBe(true);
    });

    it('should return false for non-5xx HTTP errors', () => {
      expect(isInternalServerError({ response: { status: 400 } })).toBe(false);
      expect(isInternalServerError({ response: { status: 401 } })).toBe(false);
      expect(isInternalServerError({ response: { status: 404 } })).toBe(false);
      expect(isInternalServerError({ response: { status: 422 } })).toBe(false);
    });

    it('should return false for values without a numeric response status', () => {
      expect(isInternalServerError(new Error('Failed to fetch'))).toBe(false);
      expect(isInternalServerError({ response: {} })).toBe(false);
      expect(isInternalServerError(null)).toBe(false);
      expect(isInternalServerError(undefined)).toBe(false);
      expect(isInternalServerError(42)).toBe(false);
    });
  });
});
