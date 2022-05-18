import config from '../src/config';
import { idAttribute } from '../src/damageAreas/schema';
import { IdResponse } from '../src/sharedTypes';
import * as views from '../src/views';
import { CreateView } from '../src/views/apiTypes';
import { initAxiosConfig } from './utils/axiosConfig.utils';
import { mockAxiosRequest } from './utils/axiosMock.utils';
import { deepObjectMatcher } from './utils/matcher.utils';

jest.mock('axios');

beforeAll(() => {
  initAxiosConfig();
});

describe('views', () => {
  describe('#createOne()', () => {
    function givenParams(): { inspectionId: string, createView: CreateView, axiosResponse: IdResponse<'id'> } {
      return {
        inspectionId: 'inspectionId',
        createView: {
          imageId: 'imageId',
          boundingBox: { height: 5, width: 5, xmin: 0, ymin: 0 },
        },
        axiosResponse: { id: 'my-id' },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, createView, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await views.createOne(inspectionId, createView);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'post',
        url: `/inspections/${inspectionId}/views`,
      }));
    });

    it('should map the body keys to snake case', async () => {
      const { inspectionId, createView, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await views.createOne(inspectionId, createView);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        data: { image_id: createView.imageId, bounding_box: createView.boundingBox },
      }));
    });

    it('should return a correct corejs response with a normalized vehicle entity', async () => {
      const { inspectionId, createView, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await views.createOne(inspectionId, createView);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(axiosResponse.id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        views: {
          [axiosResponse.id]: {
            [idAttribute]: axiosResponse.id,
            createdAt: expect.any(String) as unknown,
            imageRegion: {
              imageId: createView.imageId,
              specification: {
                polygons: createView.polygons,
                boundingBox: createView.boundingBox,
              },
            },
          },
        },
      }));
      expect(corejsResponse.result).toEqual(axiosResponse.id);
    });
  });

  describe('#deleteOne()', () => {
    function givenParams(): { id: string, inspectionId: string, axiosResponse: IdResponse<'id'> } {
      const id = 'my-id';
      return {
        id,
        inspectionId: 'inspectionId',
        axiosResponse: { id },
      };
    }

    it('should use the correct axios config', async () => {
      const { id, inspectionId, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await views.deleteOne(id, inspectionId);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'delete',
        url: `/inspections/${inspectionId}/views/${id}`,
      }));
    });

    it('should return a correct corejs response', async () => {
      const { id, inspectionId, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await views.deleteOne(id, inspectionId);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse.inspectionId).toEqual(inspectionId);
      expect(corejsResponse[idAttribute]).toEqual(axiosResponse.id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        views: {
          [axiosResponse.id]: { [idAttribute]: axiosResponse.id },
        },
      }));
      expect(corejsResponse.result).toEqual(axiosResponse.id);
    });
  });
});
