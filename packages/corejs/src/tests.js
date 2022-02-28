import assert from 'assert';
import config from './config';
import * as damage from './damages';
import * as image from './images';
import * as inspection from './inspections';
import * as task from './tasks';
import * as vehicle from './vehicles';
import * as view from './views';

beforeEach(() => {
  config.accessToken = process.env.CI_ACCESS_TOKEN;
});

describe('damage', () => {
  describe('#createOne()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const data = {};
      const res = await damage.createOne({ inspectionId, data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#deleteOne()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const id = '';
      const res = await damage.deleteOne({ inspectionId, id });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
});

describe('image', () => {
  describe('#createOne()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const data = {};
      const res = await image.createOne({ inspectionId, data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#getMany()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const res = await image.getMany({ inspectionId });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
});

describe('inspection', () => {
  describe('#getOne()', () => {
    it('is successful', async () => {
      const id = '';
      const res = await inspection.getOne({ id });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#getMany()', () => {
    it('is successful', async () => {
      const res = await inspection.getMany({});
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#createOne()', () => {
    it('is successful', async () => {
      const data = {};
      const res = await inspection.createOne({ data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#updateOne()', () => {
    it('is successful', async () => {
      const data = {};
      const res = await inspection.upsertOne({ data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#addAdditionalDataToOne()', () => {
    it('is successful', async () => {
      const id = '';
      const data = {};
      const res = await inspection.addAdditionalDataToOne({ id, data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#deleteOne()', () => {
    it('is successful', async () => {
      const id = '';
      const res = await inspection.deleteOne({ id });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
});

describe('task', () => {
  describe('#getOne()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const name = task.NAMES.damageDetection;
      const res = await task.getOne({ inspectionId, name });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#getMany()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const res = await task.getMany({ inspectionId });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#updateOne()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const name = task.NAMES.damageDetection;
      const data = {};
      const res = await task.updateOne({ inspectionId, name, data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
});

describe('vehicle', () => {
  describe('#updateOne()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const data = {};
      const res = await vehicle.updateOne({ inspectionId, data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
});

describe('view', () => {
  describe('#createOne()', () => {
    it('is successful', async () => {
      const inspectionId = '';
      const data = {};
      const res = await view.createOne({ inspectionId, data });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
  describe('#deleteOne()', () => {
    it('is successful', async () => {
      const id = '';
      const inspectionId = '';
      const res = await view.deleteOne({ id, inspectionId });
      assert.equal(res.axiosResponse.statusText, 'OK');
    });
  });
});
