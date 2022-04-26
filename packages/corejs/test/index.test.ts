import config from '../src/config';
import * as damage from '../src/damages';
import * as image from '../src/images';
import * as inspection from '../src/inspections';
import * as task from '../src/tasks';
import { TaskName } from '../src/tasks/entityTypes';
import * as vehicle from '../src/vehicles';
import inspectionExample from './examples/inspection.example';
import damageExample from './examples/damage.example';
import imageExample from './examples/image.example';

let inspectionId = '';

beforeAll(async () => {
  config.axiosConfig.baseURL = 'https://api.staging.monk.ai/v1/';
  config.authConfig.domain = 'idp.staging.monk.ai';
  config.authConfig.audience = 'https://api.monk.ai/v1/';
  config.accessToken = process.env.CI_ACCESS_TOKEN;

  const res = await inspection.createOne(inspectionExample);
  inspectionId = res.id;
});

afterAll(async () => {
  await inspection.deleteOne(inspectionId);
  inspectionId = '';
});

describe('damage', () => {
  describe('#createOne() and #deleteOne()', () => {
    it('are successful', async () => {
      const createResult = await damage.createOne(inspectionId, damageExample);
      expect(createResult.axiosResponse.statusText).toEqual('CREATED');
      const deleteResult = await damage.deleteOne(inspectionId, createResult.id);
      expect(deleteResult.axiosResponse.statusText).toEqual('OK');
    });
  });
});

describe('image', () => {
  describe('#addOne()', () => {
    it('is successful', async () => {
      const result = await image.addOne(inspectionId, imageExample);
      expect(result.axiosResponse.statusText).toEqual('CREATED');
    });
  });
  describe('#getMany()', () => {
    it('is successful', async () => {
      const result = await image.getMany(inspectionId);
      expect(result.axiosResponse.statusText).toEqual('OK');
    });
  });
});

describe('inspection', () => {
  describe('#getOne()', () => {
    it('is successful', async () => {
      const result = await inspection.getOne(inspectionId);
      expect(result.axiosResponse.statusText).toEqual('OK');
    });
  });
  describe('#getMany()', () => {
    it('is successful', async () => {
      const result = await inspection.getMany();
      expect(result.axiosResponse.statusText).toEqual('OK');
    });
  });
  describe('#addAdditionalDataToOne()', () => {
    it('is successful', async () => {
      const data = {};
      const result = await inspection.addAdditionalDataToOne(inspectionId, data);
      expect(result.axiosResponse.statusText).toEqual('OK');
    });
  });
});

describe('task', () => {
  describe('#getOne()', () => {
    it('is successful', async () => {
      const name = TaskName.DAMAGE_DETECTION;
      const result = await task.getOne(inspectionId, name);
      expect(result.axiosResponse.statusText).toEqual('OK');
    });
  });
  describe('#getMany()', () => {
    it('is successful', async () => {
      const result = await task.getMany(inspectionId);
      expect(result.axiosResponse.statusText).toEqual('OK');
    });
  });
});

describe('vehicle', () => {
  describe('#updateOne()', () => {
    it('is successful', async () => {
      const data = {
        brand: 'Toyota',
      };
      const result = await vehicle.updateOne(inspectionId, data);
      expect(result.axiosResponse.statusText).toEqual('OK');
    });
  });
});
