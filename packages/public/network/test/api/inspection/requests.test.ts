jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/inspection/mappers', () => ({
  mapApiInspectionGet: jest.fn(() => ({ test: 'hello' })),
}));

import ky from 'ky';
import { MonkActionType } from '@monkvision/common';
import { getDefaultOptions } from '../../../src/api/config';
import { getInspection } from '../../../src/api/inspection';
import { mapApiInspectionGet } from '../../../src/api/inspection/mappers';

const apiConfig = { apiDomain: 'apiDomain', authToken: 'authToken' };

describe('Inspection requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInspection request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const id = 'test-inspection-id';
      const result = await getInspection(id, apiConfig);
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.get).toHaveBeenCalledWith(`inspections/${id}`, getDefaultOptions(apiConfig));
      expect(result).toEqual({
        action: {
          type: MonkActionType.GOT_ONE_INSPECTION,
          payload: mapApiInspectionGet(body),
        },
        response,
        body,
      });
    });
  });
});
