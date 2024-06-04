jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));

import ky from 'ky';
import { getDefaultOptions } from '../../../src/api/config';
import { getLiveConfig } from '../../../src/api/liveConfigs';

describe('Live Configs API requests', () => {
  describe('getLiveConfig request', () => {
    it('should fetch the live config at the proper URL', async () => {
      const id = 'test-live-config-id-test';
      const result = await getLiveConfig(id);

      expect(getDefaultOptions).toHaveBeenCalledWith();
      expect(ky.get).toHaveBeenCalledWith(
        `https://storage.googleapis.com/monk-front-public/live-configurations/${id}.json`,
        getDefaultOptions(),
      );
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();
      expect(result).toEqual(body);
    });
  });
});
