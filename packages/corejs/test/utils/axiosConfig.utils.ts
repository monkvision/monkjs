import config from '../../src/config';

export const baseUrl = 'https://api.test.ai/v1/';
export const accessToken = 'test-access-token';

export function initAxiosConfig(): void {
  config.axiosConfig.baseURL = baseUrl;
  config.accessToken = accessToken;
}
