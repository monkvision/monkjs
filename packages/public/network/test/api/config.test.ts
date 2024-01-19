import packageJson from '../../package.json';
import { getKyConfig, MonkAPIConfig, sdkVersion } from '../../src/api/config';

describe('Network package API global config utils', () => {
  describe('sdkVersion global constant', () => {
    it('should be equal to the current package version', () => {
      expect(sdkVersion).toEqual(packageJson.version);
    });
  });

  describe('getKyConfig function', () => {
    const baseConfig: MonkAPIConfig = {
      apiDomain: 'testapidomain',
      authToken: 'Bearer testtoken',
    };

    it('should set the baseURL property', () => {
      expect(getKyConfig(baseConfig)).toEqual(
        expect.objectContaining({
          baseUrl: `https://${baseConfig.apiDomain}`,
        }),
      );
    });

    it('should remove the ending slash from the baseURL property', () => {
      expect(getKyConfig({ ...baseConfig, apiDomain: `${baseConfig.apiDomain}/` })).toEqual(
        expect.objectContaining({
          baseUrl: `https://${baseConfig.apiDomain}`,
        }),
      );
    });

    it('should set the Access-Control-Allow-Origin header', () => {
      expect(getKyConfig(baseConfig)).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Access-Control-Allow-Origin': '*',
          }),
        }),
      );
    });

    it('should set the Authorization header', () => {
      expect(getKyConfig(baseConfig)).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: baseConfig.authToken,
          }),
        }),
      );
    });

    it('should add the "Bearer " prefix to the token if it is missing', () => {
      const authToken = 'testtokentest';
      expect(getKyConfig({ ...baseConfig, authToken })).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${authToken}`,
          }),
        }),
      );
    });

    it('should set the X-Monk-SDK-Version header', () => {
      expect(getKyConfig(baseConfig)).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Monk-SDK-Version': packageJson.version,
          }),
        }),
      );
    });
  });
});
