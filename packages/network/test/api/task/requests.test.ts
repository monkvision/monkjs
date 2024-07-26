jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/inspection/mappers', () => ({
  mapApiInspectionGet: jest.fn(() => ({ test: 'hello' })),
}));

import ky from 'ky';
import { ProgressStatus, TaskName } from '@monkvision/types';
import { MonkActionType } from '@monkvision/common';
import { getDefaultOptions } from '../../../src/api/config';
import { startInspectionTasks, updateTaskStatus } from '../../../src/api/task';

const apiConfig = {
  apiDomain: 'apiDomain',
  authToken: 'authToken',
  thumbnailDomain: 'thumbnailDomain',
};

describe('Task requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTaskStatus request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const dispatch = jest.fn();
      const inspectionId = 'test-inspection-id';
      const name = TaskName.WHEEL_ANALYSIS;
      const status = ProgressStatus.TODO;
      const result = await updateTaskStatus({ inspectionId, name, status }, apiConfig, dispatch);
      const response = await (ky.patch as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.patch).toHaveBeenCalledWith(`inspections/${inspectionId}/tasks/${name}`, {
        ...getDefaultOptions(apiConfig),
        json: { status },
        retry: {
          methods: ['patch'],
          limit: 4,
          backoffLimit: 1500,
        },
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.UPDATED_MANY_TASKS,
        payload: [{ id: undefined, status }],
      });
      expect(result).toEqual({
        id: undefined,
        response,
        body,
      });
    });
  });

  describe('startInspectionTasks request', () => {
    it('should make the proper API calls', async () => {
      const inspectionId = 'test-inspection-id';
      const names = [TaskName.WHEEL_ANALYSIS, TaskName.DAMAGE_DETECTION];
      const dispatch = jest.fn();
      const result = await startInspectionTasks({ inspectionId, names }, apiConfig, dispatch);
      const response0 = await (ky.patch as jest.Mock).mock.results[0].value;
      const body0 = await response0.json();
      const response1 = await (ky.patch as jest.Mock).mock.results[1].value;
      const body1 = await response1.json();

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      names.forEach((name) => {
        expect(ky.patch).toHaveBeenCalledWith(`inspections/${inspectionId}/tasks/${name}`, {
          ...getDefaultOptions(apiConfig),
          json: { status: ProgressStatus.TODO },
          retry: {
            methods: ['patch'],
            limit: 4,
            backoffLimit: 1500,
          },
        });
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.UPDATED_MANY_TASKS,
        payload: [
          { id: undefined, status: ProgressStatus.TODO },
          { id: undefined, status: ProgressStatus.TODO },
        ],
      });
      expect(result).toEqual([
        {
          response: response0,
          body: body0,
        },
        {
          response: response1,
          body: body1,
        },
      ]);
    });
  });
});
