import config from '../src/config';
import * as damageAreas from '../src/damageAreas';
import { CenterOnElement, DamageArea } from '../src/damageAreas/entityTypes';
import { idAttribute } from '../src/damageAreas/schema';
import { initAxiosConfig } from './utils/axiosConfig.utils';
import { mockAxiosRequest } from './utils/axiosMock.utils';
import { deepObjectMatcher } from './utils/matcher.utils';

jest.mock('axios');

beforeAll(() => {
  initAxiosConfig();
});

describe('damageAreas', () => {
  describe('#upsertOne()', () => {
    function givenParams(): { inspectionId: string, imageId: string, damageArea: DamageArea } {
      return {
        inspectionId: 'inspectionId',
        imageId: 'imageId',
        damageArea: { id: 'my-id', relevantElements: [CenterOnElement.FRONT, CenterOnElement.BUMPER_FRONT] },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, imageId, damageArea } = givenParams();
      const { spy } = mockAxiosRequest(damageArea);

      await damageAreas.upsertOne(inspectionId, imageId, damageArea);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'patch',
        url: `inspections/${inspectionId}/images/${imageId}/damage_areas`,
      }));
    });

    it('should map the body keys to snake case', async () => {
      const { inspectionId, imageId, damageArea } = givenParams();
      const { spy } = mockAxiosRequest(damageArea);

      await damageAreas.upsertOne(inspectionId, imageId, damageArea);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        data: {
          id: damageArea.id,
          relevant_elements: damageArea.relevantElements,
        },
      }));
    });

    it('should return a correct corejs response with a normalized damage area entity', async () => {
      const { inspectionId, imageId, damageArea } = givenParams();
      const { response } = mockAxiosRequest(damageArea);

      const corejsResponse = await damageAreas.upsertOne(inspectionId, imageId, damageArea);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(damageArea.id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        damageAreas: {
          [damageArea.id]: damageArea,
        },
      }));
      expect(corejsResponse.result).toEqual(damageArea.id);
    });
  });
});
