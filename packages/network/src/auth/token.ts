import { JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { MonkApiPermission } from '@monkvision/types';
import { STORAGE_KEY_AUTH_TOKEN, useMonkSearchParams, MonkSearchParam } from '@monkvision/common';
import { AuthConfig } from './authProvider.types';

/**
 * The payload of the authentication token used with the Monk API.
 */
export interface MonkJwtPayload extends JwtPayload {
  /**
   * The array of permissions that the user has.
   */
  permissions?: MonkApiPermission[];
  /**
   * The Auth0 Client ID of the application.
   */
  azp?: string;
}

/**
 * Decode the given Monk auth token and returns the MonkJwtPayload.
 */
export function decodeMonkJwt(token: string): MonkJwtPayload {
  return jwtDecode<MonkJwtPayload>(token);
}

/**
 * Utility function that checks if the given user has all the required authroizations. You can either pass an auth token
 * to be decoded or the JWT payload directly.
 */
export function isUserAuthorized(
  tokenOrPayload: MonkJwtPayload | string | null,
  permissions: MonkApiPermission[],
): boolean {
  if (!tokenOrPayload) {
    return false;
  }
  const payload =
    typeof tokenOrPayload === 'object' ? tokenOrPayload : decodeMonkJwt(tokenOrPayload);
  return permissions.every((requiredPermission) =>
    payload.permissions?.includes(requiredPermission),
  );
}

/**
 * Utility function that checks if an authorization token is expired or not. You can either pass an auth token to be
 * decoded or the JWT payload directly.
 */
export function isTokenExpired(tokenOrPayload: MonkJwtPayload | string | null): boolean {
  if (!tokenOrPayload) {
    return false;
  }
  const payload =
    typeof tokenOrPayload === 'object' ? tokenOrPayload : decodeMonkJwt(tokenOrPayload);
  return !payload.exp || Math.round(Date.now() / 1000) >= payload.exp;
}

/**
 * Utility function that checks if the stored auth token is valid for the given Auth0 Client ID.
 */
export function isTokenValid(clientID: string): boolean {
  const fetchedToken = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
  const fetchedTokenDecoded = fetchedToken ? decodeMonkJwt(fetchedToken).azp : null;
  return fetchedTokenDecoded === clientID;
}

/**
 * Utility function that retrieves the appropriate AuthConfig based on the URL search params
 * (ie. MonkSearchParam.CLIENT_ID).
 */
export function getApiConfigOrThrow(configs: AuthConfig[]): AuthConfig {
  const { get } = useMonkSearchParams();

  if (!configs.length) {
    throw new Error('No authentication configurations provided');
  }

  const defaultClientId = configs[0];
  const clientId = get(MonkSearchParam.CLIENT_ID);
  const authConfig = configs.find((config) => config.clientId === clientId);
  return authConfig ?? defaultClientId;
}
