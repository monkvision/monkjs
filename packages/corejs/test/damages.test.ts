import config from '../src/config';
import { idAttribute } from '../src/damageAreas/schema';
import * as damages from '../src/damages';
import { CreateDamage } from '../src/damages/apiTypes';
import { DamageType } from '../src/damages/entityTypes';
import { PartType } from '../src/parts/entityTypes';
import { IdResponse } from '../src/sharedTypes';
import { initAxiosConfig } from './utils/axiosConfig.utils';
import { mockAxiosRequest } from './utils/axiosMock.utils';
import { deepObjectMatcher } from './utils/matcher.utils';

jest.mock('axios');

beforeAll(() => {
  initAxiosConfig();
});

describe('damages', () => {
  describe('#createOne()', () => {
    function givenParams(): { inspectionId: string, createDamage: CreateDamage, axiosResponse: IdResponse<'id'> } {
      return {
        inspectionId: 'inspectionId',
        createDamage: { damageType: DamageType.DENT, partType: PartType.BUMPER_FRONT },
        axiosResponse: { id: 'my-id' },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, createDamage, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await damages.createOne(inspectionId, createDamage);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'post',
        url: `/inspections/${inspectionId}/damages`,
      }));
    });

    it('should map the body keys to snake case', async () => {
      const { inspectionId, createDamage, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await damages.createOne(inspectionId, createDamage);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        data: {
          damage_type: createDamage.damageType,
          part_type: createDamage.partType,
        },
      }));
    });

    it('should return a correct corejs response with a normalized damage entity', async () => {
      const { inspectionId, createDamage, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await damages.createOne(inspectionId, createDamage);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(axiosResponse.id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        damages: {
          [axiosResponse.id]: {
            id: axiosResponse.id,
            damageType: createDamage.damageType,
          },
        },
      }));
      expect(corejsResponse.result).toEqual(deepObjectMatcher(axiosResponse.id));
    });
  });

  describe('#deleteOne()', () => {
    function givenParams(): { inspectionId: string, id: string, axiosResponse: IdResponse<'id'> } {
      const id = 'my-id';
      return {
        inspectionId: 'inspectionId',
        id,
        axiosResponse: { id },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, id, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await damages.deleteOne(inspectionId, id);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'delete',
        url: `/inspections/${inspectionId}/damages/${id}`,
      }));
    });

    it('should return a correct corejs response', async () => {
      const { inspectionId, id, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await damages.deleteOne(inspectionId, id);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        damages: {
          [id]: { id: axiosResponse.id },
        },
      }));
      expect(corejsResponse.result).toEqual(id);
    });
  });
});
