import { Options } from 'ky';
import packageJson from '../../package.json';
import { beforeError } from './error';

export const sdkVersion = packageJson.version;

/**
 * Required configuration properties used when interacting with the MonkJs API.
 */
export interface MonkApiConfig {
  /**
   * The domain of the Monk API.
   */
  apiDomain: string;
  /**
   * The authentication token used to communicate with the API.
   */
  authToken: string;
  /**
   * The API domain used to communicate with the resize micro service.
   */
  thumbnailDomain: string;
}

function getPrefixUrl(config?: MonkApiConfig): string | undefined {
  if (!config) {
    return undefined;
  }
  const apiDomain = config.apiDomain.endsWith('/')
    ? config.apiDomain.substring(0, config.apiDomain.length - 1)
    : config.apiDomain;
  return `https://${apiDomain}`;
}

function getAuthorizationHeader(config?: MonkApiConfig): string | undefined {
  if (!config) {
    return undefined;
  }
  return config.authToken.startsWith('Bearer ') ? config.authToken : `Bearer ${config.authToken}`;
}

export function getDefaultOptions(config?: MonkApiConfig): Options {
  return {
    prefixUrl: getPrefixUrl(config),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Access-Control-Allow-Origin': '*',
      'Authorization': getAuthorizationHeader(config),
      'X-Monk-SDK-Version': sdkVersion,
    },
    hooks: {
      beforeError: [beforeError],
    },
    timeout: 30000,
  };
}
