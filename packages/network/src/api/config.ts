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
}

export function getDefaultOptions(config: MonkApiConfig): Options {
  const apiDomain = config.apiDomain.endsWith('/')
    ? config.apiDomain.substring(0, config.apiDomain.length - 1)
    : config.apiDomain;
  const authorizationHeader = config.authToken.startsWith('Bearer ')
    ? config.authToken
    : `Bearer ${config.authToken}`;
  return {
    prefixUrl: `https://${apiDomain}`,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Access-Control-Allow-Origin': '*',
      'Authorization': authorizationHeader,
      'X-Monk-SDK-Version': sdkVersion,
    },
    hooks: {
      beforeError: [beforeError],
    },
    timeout: 30000,
  };
}
