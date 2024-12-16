import {
  AdditionalData,
  ComplianceIssue,
  ComplianceOptions,
  Inspection,
  MonkEntityType,
  TaskName,
} from '@monkvision/types';
import { MonkActionType } from '@monkvision/common';
import ky from 'ky';

const additionalData = {
  country: 'USA',
  other_damages: [
    {
      area: 'seats',
      damage_type: 'scratch',
      repair_cost: 544,
    },
  ],
};
const mockInspection: Inspection = {
  id: 'test-inspection-id',
  additionalData,
  damages: [],
  entityType: MonkEntityType.INSPECTION,
  images: [],
  parts: [],
  tasks: [],
};
const mockUrlParams = 'test-url-params';

jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/inspection/mappers', () => ({
  mapApiInspectionGet: jest.fn(() => ({
    inspections: [mockInspection] as unknown as Inspection[],
    parts: [],
  })),
  mapApiAllInspectionsVerboseGet: jest.fn(() => ({
    inspections: [mockInspection] as unknown as Inspection[],
    parts: [],
  })),
  mapApiInspectionPost: jest.fn(() => ({ test: 'ok-ok-ok' })),
  mapApiAllInspectionsUrlParamsGet: jest.fn(() => mockUrlParams),
}));

import { getDefaultOptions } from '../../../src/api/config';
import {
  createInspection,
  getInspection,
  getAllInspections,
  getAllInspectionsCount,
  updateAdditionalData,
} from '../../../src/api/inspection';
import {
  mapApiAllInspectionsUrlParamsGet,
  mapApiAllInspectionsVerboseGet,
  mapApiInspectionGet,
  mapApiInspectionPost,
} from '../../../src/api/inspection/mappers';
import { ApiAllInspectionsVerboseGet, ApiPaginatedResponse } from '../../../src/api/models';

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

  describe('updateAdditionalData request', () => {
    it('should make the proper API call', async () => {
      const id = 'test-inspection-id';
      const callback = (addData?: AdditionalData) => {
        const newAddData = {
          ...addData,
          ...additionalData,
        };
        return newAddData;
      };
      const options = { id, callback };
      const result = await updateAdditionalData(options, apiConfig);
      const response = await (ky.patch as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.patch).toHaveBeenCalledWith(`inspections/${id}`, {
        ...getDefaultOptions(apiConfig),
        json: { additional_data: additionalData },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });
  });

  describe('getAllInspections request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const before = 'before';
      const after = 'after';
      (ky.get as jest.Mock).mockImplementationOnce(() => {
        const helpers = {
          json: jest.fn(() =>
            Promise.resolve({
              data: ['test'],
              paging: { cursors: { before, after } },
            }),
          ),
          blob: jest.fn(() => Promise.resolve(new Blob())),
        };
        const response = Promise.resolve({
          status: 200,
          ...helpers,
        });
        Object.assign(response, helpers);
        return response;
      });
      const options = { filters: { test: 'test' } };
      const dispatch = jest.fn();
      const result = await getAllInspections(options, apiConfig, dispatch);
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(mapApiAllInspectionsUrlParamsGet).toHaveBeenCalledWith(options, true, false);
      expect(mapApiAllInspectionsVerboseGet).toHaveBeenCalledWith(
        (body as ApiPaginatedResponse<ApiAllInspectionsVerboseGet>).data,
        apiConfig.thumbnailDomain,
      );
      const entities = (mapApiAllInspectionsVerboseGet as jest.Mock).mock.results[0].value;
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.get).toHaveBeenCalledWith(
        `inspections${mockUrlParams}`,
        getDefaultOptions(apiConfig),
      );
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.GOT_ONE_INSPECTION,
        payload: entities,
      });
      expect(result).toEqual({
        entities,
        response,
        body,
        pagination: { before, after },
      });
    });
  });

  describe('getAllInspectionsCount request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const dispatch = jest.fn();
      const options = { filters: { test: 'test' } };
      const result = await getAllInspectionsCount(options, apiConfig, dispatch);
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(mapApiAllInspectionsUrlParamsGet).toHaveBeenCalledWith(options, null, false);
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.get).toHaveBeenCalledWith(
        `inspections/count${mockUrlParams}`,
        getDefaultOptions(apiConfig),
      );
      expect(result).toEqual({
        count: body.count,
        response,
        body,
      });
    });
  });
});
