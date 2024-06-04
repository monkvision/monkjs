import packageJson from '../../package.json';
import { getDefaultOptions, MonkApiConfig, sdkVersion } from '../../src/api/config';
import { beforeError } from '../../src/api/error';

describe('Network package API global config utils', () => {
  describe('sdkVersion global constant', () => {
    it('should be equal to the current package version', () => {
      expect(sdkVersion).toEqual(packageJson.version);
    });
  });

  describe('getDefaultOptions function', () => {
    const baseConfig: MonkApiConfig = {
      apiDomain: 'testapidomain',
      authToken: 'Bearer testtoken',
    };

    it('should return no prefixUrl and Authorization header if no API config is provided', () => {
      const options = getDefaultOptions();
      expect(options.prefixUrl).toBeUndefined();
      expect(options.headers).toEqual(expect.objectContaining({ Authorization: undefined }));
    });

    it('should return the proper prefixUrl', () => {
      expect(getDefaultOptions(baseConfig).prefixUrl).toEqual(`https://${baseConfig.apiDomain}`);
    });

    it('should remove the ending slash from the prefixUrl property', () => {
      expect(
        getDefaultOptions({ ...baseConfig, apiDomain: `${baseConfig.apiDomain}/` }).prefixUrl,
      ).toEqual(`https://${baseConfig.apiDomain}`);
    });

    it('should set the Accept header', () => {
      expect(getDefaultOptions(baseConfig).headers).toEqual(
        expect.objectContaining({
          Accept: 'application/json, text/plain, */*',
        }),
      );
    });

    it('should set the Access-Control-Allow-Origin header', () => {
      expect(getDefaultOptions(baseConfig).headers).toEqual(
        expect.objectContaining({
          'Access-Control-Allow-Origin': '*',
        }),
      );
    });

    it('should set the Authorization header', () => {
      expect(getDefaultOptions(baseConfig).headers).toEqual(
        expect.objectContaining({
          Authorization: baseConfig.authToken,
        }),
      );
    });

    it('should add the "Bearer " prefix to the token if it is missing', () => {
      const authToken = 'testtokentest';
      expect(getDefaultOptions({ ...baseConfig, authToken }).headers).toEqual(
        expect.objectContaining({
          Authorization: `Bearer ${authToken}`,
        }),
      );
    });

    it('should set the X-Monk-SDK-Version header', () => {
      expect(getDefaultOptions(baseConfig).headers).toEqual(
        expect.objectContaining({
          'X-Monk-SDK-Version': packageJson.version,
        }),
      );
    });

    it('should return the proper beforeError hook', () => {
      expect(getDefaultOptions(baseConfig).hooks?.beforeError).toContain(beforeError);
    });

    it('should set a default timeout of 30s', () => {
      expect(getDefaultOptions(baseConfig).timeout).toEqual(30000);
    });
  });
});
