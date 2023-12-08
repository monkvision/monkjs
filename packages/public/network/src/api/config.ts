import { AxiosRequestConfig } from 'axios';
import packageJson from '../../package.json';

export const sdkVersion = packageJson.version;

/**
 * Required configuration properties used when interacting with the MonkJs API.
 */
export interface MonkAPIRequestConfig {
  /**
   * The domain of the Monk API.
   */
  apiDomain: string;
  /**
   * The authentication token used to communicate with the API.
   */
  authToken: string;
}

export function getBaseAxiosConfig(config: MonkAPIRequestConfig): AxiosRequestConfig {
  const apiDomain = config.apiDomain.endsWith('/')
    ? config.apiDomain.substring(0, config.apiDomain.length - 1)
    : config.apiDomain;
  const authorizationHeader = config.authToken.startsWith('Bearer ')
    ? config.authToken
    : `Bearer ${config.authToken}`;
  return {
    baseURL: `https://${apiDomain}`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': authorizationHeader,
      'X-Monk-SDK-Version': sdkVersion,
    },
  };
}
