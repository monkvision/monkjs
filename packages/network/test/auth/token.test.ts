jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    permissions: ['monk_core_api:inspections:create', 'monk_core_api:inspections:read'],
  })),
}));

jest.mock('@monkvision/common', () => {
  const actual = jest.requireActual('@monkvision/common');
  return {
    ...actual,
    useMonkSearchParams: jest.fn(),
  };
});

import { MonkApiPermission } from '@monkvision/types';
import { jwtDecode } from 'jwt-decode';
import {
  decodeMonkJwt,
  isTokenExpired,
  isUserAuthorized,
  MonkJwtPayload,
  isTokenValid,
  getApiConfigOrThrow,
} from '../../src';
import { STORAGE_KEY_AUTH_TOKEN, useMonkSearchParams } from '@monkvision/common';
import { AuthConfig } from '../../src/auth/authProvider.types';

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

  describe('isTokenValid function', () => {
    beforeEach(() => {
      localStorage.clear();
      (jwtDecode as jest.Mock).mockReset();
    });

    it('should return false when no token is stored', () => {
      expect(isTokenValid('client-123')).toBe(false);
    });

    it('should return true when stored token azp matches client ID', () => {
      localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'encoded-token');
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({ azp: 'client-123' }));
      expect(isTokenValid('client-123')).toBe(true);
      expect(jwtDecode).toHaveBeenCalledWith('encoded-token');
    });

    it('should return false when stored token azp differs from client ID', () => {
      localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'encoded-token');
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({ azp: 'client-XYZ' }));
      expect(isTokenValid('client-123')).toBe(false);
    });
  });

  describe('getApiConfigOrThrow function', () => {
    const mockUseSearchParams = useMonkSearchParams as unknown as jest.Mock;

    beforeEach(() => {
      mockUseSearchParams.mockReset();
    });

    const configs: AuthConfig[] = [
      {
        clientId: 'client-A',
        domain: 'a.auth0.com',
        authorizationParams: { redirect_uri: 'https://a.example.com' },
        context: undefined,
      },
      {
        clientId: 'client-B',
        domain: 'b.auth0.com',
        authorizationParams: { redirect_uri: 'https://b.example.com' },
        context: undefined,
      },
    ];

    it('should throw when no authentication configurations are provided', () => {
      mockUseSearchParams.mockReturnValue({ get: jest.fn().mockReturnValue(undefined) });
      expect(() => getApiConfigOrThrow([] as AuthConfig[])).toThrow(
        'No authentication configurations provided',
      );
    });

    it('should return first config when no matching clientId in params', () => {
      mockUseSearchParams.mockReturnValue({ get: jest.fn().mockReturnValue(undefined) });
      const result = getApiConfigOrThrow(configs);
      expect(result).toBe(configs[0]);
    });

    it('should return matching config when clientId is present in params', () => {
      mockUseSearchParams.mockReturnValue({ get: jest.fn().mockReturnValue('client-B') });
      const result = getApiConfigOrThrow(configs);
      expect(result).toBe(configs[1]);
    });
  });
});
