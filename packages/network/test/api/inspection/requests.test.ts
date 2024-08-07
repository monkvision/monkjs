jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/inspection/mappers', () => ({
  mapApiInspectionGet: jest.fn(() => ({ test: 'hello' })),
  mapApiInspectionPost: jest.fn(() => ({ test: 'ok-ok-ok' })),
}));

import { ComplianceIssue, ComplianceOptions, TaskName } from '@monkvision/types';
import ky from 'ky';
import { MonkActionType } from '@monkvision/common';
import { getDefaultOptions } from '../../../src/api/config';
import { createInspection, getInspection } from '../../../src/api/inspection';
import { mapApiInspectionGet, mapApiInspectionPost } from '../../../src/api/inspection/mappers';

const apiConfig = {
  apiDomain: 'apiDomain',
  authToken: 'authToken',
  thumbnailDomain: 'thumbnailDomain',
};

describe('Inspection requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInspection request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const id = 'test-inspection-id';
      const compliance: ComplianceOptions = {
        enableCompliance: true,
        complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
      };
      const dispatch = jest.fn();
      const result = await getInspection({ id, compliance }, apiConfig, dispatch);
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(mapApiInspectionGet).toHaveBeenCalledWith(body, apiConfig.thumbnailDomain, compliance);
      const entities = (mapApiInspectionGet as jest.Mock).mock.results[0].value;
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.get).toHaveBeenCalledWith(`inspections/${id}`, getDefaultOptions(apiConfig));
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.GOT_ONE_INSPECTION,
        payload: entities,
      });
      expect(result).toEqual({
        entities,
        response,
        body,
      });
    });
  });

  describe('createInspection request', () => {
    it('should make the proper API call and map the request payload', async () => {
      const body = { id: 'test-fake-id' };
      const response = { json: jest.fn(() => Promise.resolve(body)) };
      (ky.post as jest.Mock).mockImplementationOnce(() => Promise.resolve(response));
      const options = { tasks: [TaskName.DAMAGE_DETECTION] };
      const result = await createInspection(options, apiConfig);

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(mapApiInspectionPost).toHaveBeenCalledWith(options);
      const apiInspectionPost = (mapApiInspectionPost as jest.Mock).mock.results[0].value;
      expect(ky.post).toHaveBeenCalledWith('inspections', {
        ...getDefaultOptions(apiConfig),
        json: apiInspectionPost,
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });
  });
});
