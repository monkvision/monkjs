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

const apiConfig = { apiDomain: 'apiDomain', authToken: 'authToken' };

describe('Task requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateTaskStatus request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const inspectionId = 'test-inspection-id';
      const name = TaskName.WHEEL_ANALYSIS;
      const status = ProgressStatus.TODO;
      const result = await updateTaskStatus(inspectionId, name, status, apiConfig);
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
      expect(result).toEqual({
        action: {
          type: MonkActionType.UPDATED_MANY_TASKS,
          payload: [{ id: undefined, status }],
        },
        response,
        body,
      });
    });
  });

  describe('startInspectionTasks request', () => {
    it('should make the proper API calls', async () => {
      const inspectionId = 'test-inspection-id';
      const names = [TaskName.WHEEL_ANALYSIS, TaskName.DAMAGE_DETECTION];
      const result = await startInspectionTasks(inspectionId, names, apiConfig);
      const response = await (ky.patch as jest.Mock).mock.results[0].value;
      const body = await response.json();

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
      expect(result).toEqual({
        action: {
          type: MonkActionType.UPDATED_MANY_TASKS,
          payload: [
            { id: undefined, status: ProgressStatus.TODO },
            { id: undefined, status: ProgressStatus.TODO },
          ],
        },
        response,
        body,
      });
    });
  });
});
