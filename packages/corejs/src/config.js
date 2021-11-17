export const baseAxiosConfig = {
  baseURL: 'https://api.monk.ai/v1/',
  headers: { 'Access-Control-Allow-Origin': '*' },
};

export const baseAuthConfig = {
  domain: 'idv.monk.ai',
  audience: 'https://api.monk.ai/v1/',
  clientId: '',
};

export class Config {
  constructor(
    axiosConfig = baseAxiosConfig,
    authConfig = baseAuthConfig,
  ) {
    this._authConfig = authConfig;
    this._axiosConfig = axiosConfig;
  }

  get authConfig() {
    return this._authConfig;
  }

  set authConfig(value) {
    this._authConfig = value;
  }

  get axiosConfig() {
    return this._axiosConfig;
  }

  set axiosConfig(value) {
    this._axiosConfig = value;
  }

  get accessToken() {
    return this.axiosConfig.headers.Authorization;
  }

  set accessToken(value) {
    this._axiosConfig = {
      ...this.axiosConfig,
      headers: {
        ...this.axiosConfig.headers,
        Authorization: `Bearer ${value.replace('Bearer ', '')}`,
      },
    };
  }

  toPlainObject() {
    return {
      authConfig: this.authConfig,
      axiosConfig: this.axiosConfig,
    };
  }
}

export default new Config();
