import config from '../src/config';
import { idAttribute } from '../src/damageAreas/schema';
import * as images from '../src/images';
import {
  CreateImage,
  GetManyImagesOptions,
  GetOneImageOptions,
  ImageAcquisitionStrategy,
  ImageDetails,
  ImageRotation,
} from '../src/images/apiTypes';
import { Image } from '../src/images/entityTypes';
import { IdResponse, PaginatedResponse, PaginationOrder } from '../src/sharedTypes';
import { TaskName } from '../src/tasks/entityTypes';
import { initAxiosConfig } from './utils/axiosConfig.utils';
import { mockAxiosRequest } from './utils/axiosMock.utils';
import { deepObjectMatcher } from './utils/matcher.utils';
import { createMockPaging } from './utils/mockPaging';

jest.mock('axios');

beforeAll(() => {
  initAxiosConfig();
});

describe('images', () => {
  describe('#getOne()', () => {
    function givenParams(): { inspectionId: string, imageId: string, options: GetOneImageOptions, image: Image } {
      const id = 'imageId';
      return {
        inspectionId: 'inspectionId',
        imageId: id,
        options: { showDeletedObjects: true },
        image: { id, path: 'path', mimetype: 'application/jpeg', views: [] },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, imageId, options, image } = givenParams();
      const { spy } = mockAxiosRequest(image);

      await images.getOne(inspectionId, imageId, options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'get',
        url: `/inspections/${inspectionId}/images/${imageId}`,
      }));
    });

    it('should map the param keys to snake case', async () => {
      const { inspectionId, imageId, options, image } = givenParams();
      const { spy } = mockAxiosRequest(image);

      await images.getOne(inspectionId, imageId, options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        params: { show_deleted_objects: options.showDeletedObjects },
      }));
    });

    it('should return a correct corejs response with a normalized image entity', async () => {
      const { inspectionId, imageId, options, image } = givenParams();
      const { response } = mockAxiosRequest(image);

      const corejsResponse = await images.getOne(inspectionId, imageId, options);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse.inspectionId).toEqual(inspectionId);
      expect(corejsResponse[idAttribute]).toEqual(imageId);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        images: {
          [imageId]: image,
        },
      }));
      expect(corejsResponse.result).toEqual(imageId);
    });
  });

  describe('#getMany()', () => {
    function givenParams(): {
      inspectionId: string,
      options: GetManyImagesOptions,
      axiosResponse: PaginatedResponse<ImageDetails>,
    } {
      return {
        inspectionId: 'inspectionId',
        options: { after: 'after', limit: 20, paginationOrder: PaginationOrder.ASC },
        axiosResponse: {
          paging: createMockPaging(),
          data: [
            { id: 'id1', mimetype: 'application/jpeg', path: 'path' },
            { id: 'id2', mimetype: 'application/png', path: 'path' },
          ],
        },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, options, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await images.getMany(inspectionId, options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'get',
        url: `/inspections/${inspectionId}/images`,
      }));
    });

    it('should map the param keys to snake case', async () => {
      const { inspectionId, options, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await images.getMany(inspectionId, options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        params: { after: options.after, limit: options.limit, pagination_order: options.paginationOrder },
      }));
    });

    it('should return a correct corejs response with a normalized list of image entities', async () => {
      const { inspectionId, options, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await images.getMany(inspectionId, options);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse.inspectionId).toEqual(inspectionId);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        images: {
          [axiosResponse.data[0].id]: axiosResponse.data[0],
          [axiosResponse.data[1].id]: axiosResponse.data[1],
        },
      }));
      expect(corejsResponse.result).toEqual(deepObjectMatcher(axiosResponse.data.map((image) => image.id)));
    });
  });

  describe('#addOne()', () => {
    function givenParams(): { inspectionId: string, createImage: CreateImage, axiosResponse: IdResponse<'id'> } {
      return {
        inspectionId: 'inspectionId',
        createImage: {
          tasks: [TaskName.WHEEL_ANALYSIS, TaskName.DAMAGE_DETECTION],
          acquisition: { strategy: ImageAcquisitionStrategy.DOWNLOAD_FROM_URL, url: 'url' },
          rotateImageBeforeUpload: ImageRotation.CLOCKWISE_90,
        },
        axiosResponse: { id: 'my-id' },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, createImage, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await images.addOne(inspectionId, createImage);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'post',
        url: `/inspections/${inspectionId}/images`,
      }));
    });

    it('should map the body keys to snake case', async () => {
      const { inspectionId, createImage, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await images.addOne(inspectionId, createImage);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        data: {
          tasks: createImage.tasks,
          acquisition: createImage.acquisition,
          rotate_image_before_upload: createImage.rotateImageBeforeUpload,
        },
      }));
    });

    it('should return a correct corejs response with a normalized image entity', async () => {
      const { inspectionId, createImage, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await images.addOne(inspectionId, createImage);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse.inspectionId).toEqual(inspectionId);
      expect(corejsResponse[idAttribute]).toEqual(axiosResponse.id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        images: {
          [axiosResponse.id]: { id: axiosResponse.id, name: createImage.name },
        },
      }));
      expect(corejsResponse.result).toEqual(axiosResponse.id);
    });
  });
});
