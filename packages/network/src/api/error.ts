import { HTTPError } from 'ky';
import { BeforeErrorHook } from 'ky/distribution/types/hooks';
import { ApiError } from './models';

/**
 * Enumeration of names of known error that can occur when making Monk api requests.
 */
export enum MonkNetworkError {
  /**
   * The authentication token was not provided.
   */
  MISSING_TOKEN = 'MissingToken',
  /**
   * The authentication token provided in the request is invalid (badly formatted etc.).
   */
  INVALID_TOKEN = 'InvalidToken',
  /**
   * The authentication token provided in the request is expired.
   */
  EXPIRED_TOKEN = 'TokenExpired',
  /**
   * The user corresponding to the authentication token provided in the request does not have the sufficient
   * authorization to perform the request.
   */
  INSUFFICIENT_AUTHORIZATION = 'InsufficientAuthorization',
  /**
   * The PDF requested is not available.
   */
  UNAVAILABLE_PDF = 'UnavailablePdf',
}

function getErrorMessage(name: string): string | null {
  switch (name) {
    case MonkNetworkError.MISSING_TOKEN:
      return 'Missing authentication token in request headers.';
    case MonkNetworkError.INVALID_TOKEN:
      return 'Invalid authentication token in request.';
    case MonkNetworkError.EXPIRED_TOKEN:
      return 'Authentication token is expired.';
    case MonkNetworkError.INSUFFICIENT_AUTHORIZATION:
      return 'User does not have the proper authorization grants to perform this request.';
    case MonkNetworkError.UNAVAILABLE_PDF:
      return 'The PDF requested is not available.';
    default:
      return null;
  }
}

function getErrorName(status: number, message: string): MonkNetworkError | null {
  if (status === 401 && message.includes('Authorization header is required')) {
    return MonkNetworkError.MISSING_TOKEN;
  }
  if (
    status === 401 &&
    [
      'Token payload schema unknown',
      'Token decode failed',
      'Token audience invalid, please check audience',
      'Token issuer invalid, please check issuer',
      'Wrong authorization header format, should be in the format : Bearer TOKEN',
      'Invalid authentication token in request.',
    ].some((str) => message.includes(str))
  ) {
    return MonkNetworkError.INVALID_TOKEN;
  }
  if (status === 401 && message.includes('Token is expired')) {
    return MonkNetworkError.EXPIRED_TOKEN;
  }
  if (status === 422 && message.includes('PDF has not been required to be generated')) {
    return MonkNetworkError.UNAVAILABLE_PDF;
  }
  // TODO : Also check conditions for MonkNetworkError.INSUFFICIENT_AUTHORIZATION.
  return null;
}

/**
 * Type definition for a network error catched by the Monk SDK. Requests made by this package will usually process the
 * error returned by the API and will include the request body (containing the error message) with the Error object
 * itself.
 */
export interface MonkHTTPError extends HTTPError {
  body?: ApiError;
}

/* eslint-disable no-param-reassign */
export const beforeError: BeforeErrorHook = async (error: HTTPError) => {
  const { response } = error;
  const clone = response.clone();
  const body = (await clone.json()) as ApiError;
  error.name = getErrorName(clone.status, body.message) ?? error.name;
  error.message = getErrorMessage(error.name) ?? error.message;
  Object.assign(error, { body });
  return error;
};
