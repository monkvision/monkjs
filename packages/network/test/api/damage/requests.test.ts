import { DamageType, MonkEntityType, VehiclePart } from '@monkvision/types';
import { deleteDamage, CreateDamageOptions, createDamage } from '../../../src/api/damage';
import { MonkActionType } from '@monkvision/common';

function createDamageMock(): CreateDamageOptions {
  return {
    id: 'test-id',
    vehiclePart: VehiclePart.ROOF,
    damageType: DamageType.SCRATCH,
  };
}

jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/damage/mappers', () => ({
  mapApiDamagePost: jest.fn(() => ({ test: 'hello' })),
  mapApiDamagePostRequest: jest.fn(() => createDamageMock()),
}));
jest.mock('ky', () => ({
  post: jest.fn(() => Promise.resolve({ json: jest.fn(() => Promise.resolve({ id: 'test-id' })) })),
  delete: jest.fn(() =>
    Promise.resolve({ json: jest.fn(() => Promise.resolve({ id: 'delete-test-fake-id' })) }),
  ),
  patch: jest.fn(() =>
    Promise.resolve({ json: jest.fn(() => Promise.resolve({ id: 'patch-test-fake-id' })) }),
  ),
}));

import ky from 'ky';
import { getDefaultOptions } from '../../../src/api/config';
import { mapApiDamagePostRequest } from '../../../src/api/damage/mappers';

const apiConfig = {
  apiDomain: 'apiDomain',
  authToken: 'authToken',
  thumbnailDomain: 'thumbnailDomain',
};

describe('Damage requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDamage request', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should make the proper API call and map the resulting response', async () => {
      const dispatch = jest.fn();
      const damage = createDamageMock();
      const result = await createDamage(damage, apiConfig, dispatch);
      const response = await (ky.post as jest.Mock).mock.results[0].value;
      const body = await response.json();

      const apiDamage = (mapApiDamagePostRequest as jest.Mock).mock.results[0].value;
      expect(mapApiDamagePostRequest).toHaveBeenCalledWith(damage.damageType, damage.vehiclePart);
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      const kyOptions = getDefaultOptions(apiConfig);
      expect(ky.post).toHaveBeenCalledWith(`inspections/${damage.id}/damages`, {
        ...kyOptions,
        json: apiDamage,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.CREATED_ONE_DAMAGE,
        payload: {
          damage: {
            entityType: MonkEntityType.DAMAGE,
            id: body.id,
            inspectionId: damage.id,
            parts: [damage.vehiclePart],
            relatedImages: [],
            type: damage.damageType,
          },
        },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });
  });

  describe('deleteDamage request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const id = 'test-inspection-id';
      const damageId = 'test-damage-id';
      const dispatch = jest.fn();
      const result = await deleteDamage({ id, damageId }, apiConfig, dispatch);
      const response = await (ky.delete as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      const kyOptions = getDefaultOptions(apiConfig);
      expect(ky.delete).toHaveBeenCalledWith(`inspections/${id}/damages/${damageId}`, {
        ...kyOptions,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.DELETED_ONE_DAMAGE,
        payload: { inspectionId: id, damageId: body.id },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });
  });
});
