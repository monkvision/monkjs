import { JwtPayload } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import { MonkApiPermission } from '@monkvision/types';

/**
 * The payload of the authentication token used with the Monk API.
 */
export interface MonkJwtPayload extends JwtPayload {
  /**
   * The array of permissions that the user has.
   */
  permissions?: MonkApiPermission[];
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
