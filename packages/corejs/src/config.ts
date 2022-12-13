import { AxiosRequestConfig } from 'axios';

/**
 * Plain object describing the configuation of corejs.
 */
export interface CoreJsConfigObject {
  /**
   * The authentication configuration used by corejs when making API calls.
   */
  authConfig: AuthConfig,
  /**
   * The default configuration for every axios requests.
   */
  axiosConfig: AxiosRequestConfig,
}

/**
 * The authentication configuration used by corejs when making API calls.
 */
export interface AuthConfig {
  /**
   * The auth domain.
   */
  domain: string,
  /**
   * The token resource identifier.
   */
  audience: string,
  /**
   * The auth0 client ID.
   */
  clientId: string,
}

/**
 * The version numbers of the Monk pacakges.
 */
export interface PackageVersions {
  /**
   * The package version of the corejs package.
   */
  corejs?: string,
  /**
   * The package version of the camera package.
   */
  camera?: string,
  /**
   * The package version of the toolkit package.
   */
  toolkit?: string,
  /**
   * The package version of the sights package.
   */
  sights?: string,
}

export const baseAuthConfig: AuthConfig = {
  domain: 'idp.monk.ai',
  audience: 'https://api.monk.ai/v1/',
  clientId: '',
};

export const baseAxiosConfig: AxiosRequestConfig = {
  baseURL: 'https://api.monk.ai/v1/',
  headers: { 'Access-Control-Allow-Origin': '*' },
};

/**
 * The corejs configuration object.
 */
export class Config {
  constructor(
    private _axiosConfig: AxiosRequestConfig = baseAxiosConfig,
    private _authConfig: AuthConfig = baseAuthConfig,
    private _packageVersions: PackageVersions = {},
  ) {}

  get authConfig(): AuthConfig {
    return this._authConfig;
  }

  set authConfig(value: AuthConfig) {
    this._authConfig = value;
  }

  get axiosConfig(): AxiosRequestConfig {
    return this._axiosConfig;
  }

  set axiosConfig(value: AxiosRequestConfig) {
    this._axiosConfig = value;
  }

  get accessToken(): string | undefined {
    return this.axiosConfig.headers?.Authorization?.toString();
  }

  set accessToken(value: string) {
    this._axiosConfig = {
      ...this.axiosConfig,
      headers: {
        ...this.axiosConfig.headers,
        Authorization: `Bearer ${value.replace('Bearer ', '')}`,
      },
    };
  }

  get packageVersions(): PackageVersions {
    return this._packageVersions;
  }

  set packageVersions(value: PackageVersions) {
    this._packageVersions = value;
  }

  toPlainObject(): CoreJsConfigObject {
    return {
      authConfig: this.authConfig,
      axiosConfig: this.axiosConfig,
    };
  }
}

export default new Config();
