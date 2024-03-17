jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    permissions: ['monk_core_api:inspections:create', 'monk_core_api:inspections:read'],
  })),
}));

import { jwtDecode } from 'jwt-decode';
import {
  decodeMonkJwt,
  isTokenExpired,
  isUserAuthorized,
  MonkApiPermission,
  MonkJwtPayload,
} from '../../src';

describe('Network package JWT utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('decodeMonkJwt function', () => {
    it('should call the jwtDecode function with the given token', () => {
      const encoded = 'testestest';
      const decoded = { test: 'coucou' };
      (jwtDecode as jest.Mock).mockImplementationOnce(() => decoded);

      const result = decodeMonkJwt(encoded);

      expect(result).toEqual(decoded);
      expect(jwtDecode).toHaveBeenCalledWith(encoded);
    });
  });

  describe('isUserAuthorized function', () => {
    it('should return false if the token is undefined', () => {
      expect(isUserAuthorized(null, [MonkApiPermission.INSPECTION_CREATE])).toBe(false);
    });

    it('should return true if the permission list is empty', () => {
      expect(isUserAuthorized('token', [])).toBe(true);
    });

    it('should return true if the user had the proper permissions for a string param', () => {
      const { permissions } = jwtDecode<MonkJwtPayload>('');
      expect(isUserAuthorized('token', permissions as any)).toBe(true);
    });

    it('should return false if the user is missing a permission for a string param', () => {
      const { permissions } = jwtDecode<MonkJwtPayload>('');
      expect(
        isUserAuthorized('token', [
          ...(permissions as any),
          MonkApiPermission.INSPECTION_UPDATE_ORGANIZATION,
        ]),
      ).toBe(false);
    });

    it('should return true if the user had the proper permissions for an object param', () => {
      const permissions = [MonkApiPermission.INSPECTION_CREATE, MonkApiPermission.INSPECTION_READ];
      const payload = { permissions };
      expect(isUserAuthorized(payload, permissions)).toBe(true);
    });

    it('should return false if the user is missing a permission for an object param', () => {
      const permissions = [MonkApiPermission.INSPECTION_CREATE, MonkApiPermission.INSPECTION_READ];
      const payload = { permissions };
      expect(
        isUserAuthorized(payload, [
          ...permissions,
          MonkApiPermission.INSPECTION_UPDATE_ORGANIZATION,
        ]),
      ).toBe(false);
    });
  });

  describe('isTokenExpired function', () => {
    it('should return false if the token is undefined', () => {
      expect(isTokenExpired(null)).toBe(false);
    });

    it('should return true if the exp field is undefined for a string param', () => {
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({
        exp: undefined,
      }));
      const token = 'test-token-test';
      expect(isTokenExpired(token)).toBe(true);
      expect(jwtDecode).toHaveBeenCalledWith(token);
    });

    it('should return true if the token is expired for a string param', () => {
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({
        exp: Date.now() / 1000 - 10000,
      }));
      expect(isTokenExpired('test')).toBe(true);
    });

    it('should return false if the token is not expired for a string param', () => {
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({
        exp: Date.now() / 1000 + 10000,
      }));
      expect(isTokenExpired('test')).toBe(false);
    });

    it('should return true if the exp field is undefined for an object param', () => {
      expect(
        isTokenExpired({
          exp: undefined,
        }),
      ).toBe(true);
    });

    it('should return true if the token is expired for an object param', () => {
      expect(
        isTokenExpired({
          exp: Date.now() / 1000 - 10000,
        }),
      ).toBe(true);
    });

    it('should return false if the token is not expired for an object param', () => {
      expect(
        isTokenExpired({
          exp: Date.now() / 1000 + 10000,
        }),
      ).toBe(false);
    });
  });
});
