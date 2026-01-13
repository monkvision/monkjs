jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    permissions: ['monk_core_api:inspections:create', 'monk_core_api:inspections:read'],
  })),
}));

import { jwtDecode } from 'jwt-decode';
import { MonkApiPermission } from '@monkvision/types';
import { MonkSearchParam, STORAGE_KEY_AUTH_TOKEN, zlibDecompress } from '@monkvision/common';
import {
  decodeMonkJwt,
  isTokenExpired,
  isUserAuthorized,
  MonkJwtPayload,
  isTokenValid,
  getAuthConfig,
} from '../../src';
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

  describe('getAuthConfig function', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      window.history.replaceState(null, '', 'https://test.app');
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

    it('should return undefined when no configs are provided', () => {
      const result = getAuthConfig([]);
      expect(result).toBeUndefined();
    });

    it('should return first config when no params are present', () => {
      window.history.replaceState(null, '', 'https://test.app');
      const result = getAuthConfig(configs);
      expect(result).toBe(configs[0]);
    });

    it('should return matching config when CLIENT_ID param is present', () => {
      const href = `https://test.app?${MonkSearchParam.CLIENT_ID}=${configs[1].clientId}`;
      window.history.replaceState(null, '', href);

      const result = getAuthConfig(configs);
      expect(result).toBe(configs[1]);
    });

    it('should return matching config from TOKEN param (decoded azp)', () => {
      const fakeToken = 'compressed-token';
      const fakeTokenDecompressed = 'decoded-token';
      const fakeDecodedTokenClientId = { azp: configs[0].clientId };

      const href = `https://test.app?${MonkSearchParam.TOKEN}=${fakeToken}`;
      window.history.replaceState(null, '', href);
      (zlibDecompress as jest.Mock).mockImplementationOnce(() => fakeTokenDecompressed);
      (jwtDecode as jest.Mock).mockImplementationOnce(() => fakeDecodedTokenClientId);

      const result = getAuthConfig(configs);
      expect(zlibDecompress).toHaveBeenCalledWith(fakeToken);
      expect(jwtDecode).toHaveBeenCalledWith(fakeTokenDecompressed);
      expect(result).toBe(configs[0]);
    });

    it('falls back to first config when no match found', () => {
      const href = `https://test.app?${MonkSearchParam.CLIENT_ID}=nonexistent`;
      window.history.replaceState(null, '', href);
      const result = getAuthConfig(configs);
      expect(result).toBe(configs[0]);
    });
  });
});
