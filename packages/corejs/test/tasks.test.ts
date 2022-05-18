import config from '../src/config';
import { idAttribute } from '../src/damageAreas/schema';
import { IdResponse, ProgressStatus, ProgressStatusUpdate } from '../src/sharedTypes';
import * as tasks from '../src/tasks';
import { InspectionTasks, UpdateTask } from '../src/tasks/apiTypes';
import { Task, TaskName } from '../src/tasks/entityTypes';
import { initAxiosConfig } from './utils/axiosConfig.utils';
import { mockAxiosRequest } from './utils/axiosMock.utils';
import { deepObjectMatcher } from './utils/matcher.utils';

jest.mock('axios');

beforeAll(() => {
  initAxiosConfig();
});

describe('tasks', () => {
  describe('#getOne()', () => {
    function givenParams(): { inspectionId: string, name: TaskName, task: Task } {
      const inspectionId = 'inspectionId';
      return {
        inspectionId,
        name: TaskName.WHEEL_ANALYSIS,
        task: {
          id: 'my-id',
          name: TaskName.WHEEL_ANALYSIS,
          inspectionId,
          status: ProgressStatus.TODO,
          images: [],
        },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, name, task } = givenParams();
      const { spy } = mockAxiosRequest(task);

      await tasks.getOne(inspectionId, name);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'get',
        url: `/inspections/${inspectionId}/tasks/${name}`,
      }));
    });

    it('should return a correct corejs response with a normalized task entity', async () => {
      const { inspectionId, name, task } = givenParams();
      const { response } = mockAxiosRequest(task);

      const corejsResponse = await tasks.getOne(inspectionId, name);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(task.id);
      expect(corejsResponse.inspectionId).toEqual(inspectionId);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        tasks: {
          [task.id]: {
            id: task.id,
            name: task.name,
            inspectionId,
            status: task.status,
            images: task.images,
          },
        },
      }));
      expect(corejsResponse.result).toEqual(task.id);
    });
  });

  describe('#getMany()', () => {
    function givenParams(): { inspectionId: string, inspectionsTasks: InspectionTasks } {
      return {
        inspectionId: 'inspectionId',
        inspectionsTasks: {
          wheelAnalysis: {
            id: 'my-id1',
            name: TaskName.WHEEL_ANALYSIS,
            status: ProgressStatus.TODO,
            images: [],
          },
          imageOcr: {
            id: 'my-id2',
            name: TaskName.IMAGES_OCR,
            status: ProgressStatus.TODO,
            images: [],
          },
        },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, inspectionsTasks } = givenParams();
      const { spy } = mockAxiosRequest(inspectionsTasks);

      await tasks.getMany(inspectionId);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'get',
        url: `/inspections/${inspectionId}/tasks`,
      }));
    });

    it('should return a correct corejs response with a normalized list of task entities', async () => {
      const { inspectionId, inspectionsTasks } = givenParams();
      const { response } = mockAxiosRequest(inspectionsTasks);

      const corejsResponse = await tasks.getMany(inspectionId);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse.inspectionId).toEqual(inspectionId);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        tasks: {
          [inspectionsTasks.wheelAnalysis.id]: inspectionsTasks.wheelAnalysis,
          [inspectionsTasks.imageOcr.id]: inspectionsTasks.imageOcr,
        },
      }));
      expect(corejsResponse.result).toEqual(deepObjectMatcher([
        inspectionsTasks.wheelAnalysis.id,
        inspectionsTasks.imageOcr.id,
      ]));
    });
  });

  describe('#updateOne()', () => {
    function givenParams(): {
      inspectionId: string,
      name: TaskName,
      updateTask: UpdateTask,
      axiosResponse: IdResponse<'id'>,
    } {
      return {
        inspectionId: 'inspectionId',
        name: TaskName.IMAGES_OCR,
        updateTask: {
          status: ProgressStatusUpdate.TODO,
          arguments: 'args',
        },
        axiosResponse: { id: 'my-id' },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, name, updateTask, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await tasks.updateOne(inspectionId, name, updateTask);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'patch',
        url: `/inspections/${inspectionId}/tasks/${name}`,
      }));
    });

    it('should return a correct corejs response with a normalized task entity', async () => {
      const { inspectionId, name, updateTask, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await tasks.updateOne(inspectionId, name, updateTask);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(axiosResponse.id);
      expect(corejsResponse.inspectionId).toEqual(inspectionId);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        tasks: {
          [axiosResponse.id]: {
            [idAttribute]: axiosResponse.id,
            name,
            status: updateTask.status,
            arguments: updateTask.arguments,
          },
        },
      }));
      expect(corejsResponse.result).toEqual(axiosResponse.id);
    });
  });
});
