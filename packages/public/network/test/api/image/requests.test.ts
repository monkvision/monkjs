jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  getFileExtensions: jest.fn(() => ['aaa', 'bbb']),
}));
jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/inspection/mappers', () => ({
  mapApiImage: jest.fn(() => ({ test: 'hello' })),
}));

import { labels, sights } from '@monkvision/sights';
import ky from 'ky';
import { ImageSubtype, ImageType, TaskName } from '@monkvision/types';
import { getFileExtensions, MonkActionType } from '@monkvision/common';
import { getDefaultOptions } from '../../../src/api/config';
import {
  AddBeautyShotImageOptions,
  Add2ShotCloseUpImageOptions,
  addImage,
} from '../../../src/api/image';
import { mapApiImage } from '../../../src/api/image/mappers';

const apiConfig = { apiDomain: 'apiDomain', authToken: 'authToken' };

function createBeautyShotImageOptions(): AddBeautyShotImageOptions {
  return {
    type: ImageType.BEAUTY_SHOT,
    picture: {
      uri: 'test-uri',
      height: 720,
      width: 1280,
      mimetype: 'image/jpeg',
    },
    inspectionId: 'test-inspection-id',
    sightId: 'test-sight-id',
    tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS],
    compliances: {
      iqa: true,
    },
  };
}

function createCloseUpImageOptions(): Add2ShotCloseUpImageOptions {
  return {
    type: ImageType.CLOSE_UP,
    picture: {
      uri: 'test-uri',
      height: 720,
      width: 1280,
      mimetype: 'image/jpeg',
    },
    inspectionId: 'test-inspection-id',
    siblingKey: 'test-sibling-key',
    firstShot: true,
    compliances: {
      iqa: true,
    },
  };
}

describe('Image requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addImage request', () => {
    it('should make a request to the proper URL and map the resulting response', async () => {
      const options = createBeautyShotImageOptions();
      const result = await addImage(options, apiConfig);
      const response = await (ky.post as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.post).toHaveBeenCalledWith(
        `inspections/${options.inspectionId}/images`,
        expect.objectContaining(getDefaultOptions(apiConfig)),
      );
      expect(result).toEqual({
        action: {
          type: MonkActionType.CREATED_ONE_IMAGE,
          payload: {
            inspectionId: options.inspectionId,
            image: mapApiImage(body, options.inspectionId),
          },
        },
        response,
        body,
      });
    });

    it('should properly create the formdata for a beautyshot', async () => {
      const fileMock = { test: 'hello' } as unknown as File;
      const fileConstructorSpy = jest.spyOn(global, 'File').mockImplementationOnce(() => fileMock);
      const options = createBeautyShotImageOptions();
      await addImage(options, apiConfig);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string)).toEqual({
        acquisition: {
          strategy: 'upload_multipart_form_keys',
          file_key: 'image',
        },
        compliances: {
          image_quality_assessment: options.compliances?.iqa ? {} : undefined,
        },
        image_type: ImageType.BEAUTY_SHOT,
        tasks: options.tasks,
        additional_data: {
          sight_id: options.sightId,
          created_at: expect.any(String),
          ...(sights[options.sightId] ? { label: labels[sights[options.sightId].label] } : {}),
        },
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.picture.mimetype);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      expect(ky.get).toHaveBeenCalledWith(options.picture.uri);
      const blob = await (ky.get as jest.Mock).mock.results[0].value.blob();
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [blob],
        expect.stringMatching(
          new RegExp(`${options.sightId}-${options.inspectionId}-\\d{13}.${filetype}`),
        ),
        { type: filetype },
      );
    });

    it('should properly create the formdata for a closeup', async () => {
      const fileMock = { test: 'hello' } as unknown as File;
      const fileConstructorSpy = jest.spyOn(global, 'File').mockImplementationOnce(() => fileMock);
      const options = createCloseUpImageOptions();
      await addImage(options, apiConfig);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string)).toEqual({
        acquisition: {
          strategy: 'upload_multipart_form_keys',
          file_key: 'image',
        },
        compliances: {
          image_quality_assessment: options.compliances?.iqa ? {} : undefined,
        },
        image_type: ImageType.CLOSE_UP,
        image_subtype: options.firstShot
          ? ImageSubtype.CLOSE_UP_PART
          : ImageSubtype.CLOSE_UP_DAMAGE,
        image_sibling_key: options.siblingKey,
        tasks: [TaskName.DAMAGE_DETECTION],
        additional_data: {
          label: {
            en: options.firstShot ? 'Close Up (part)' : 'Close Up (damage)',
            fr: options.firstShot ? 'Photo Zoomée (partie)' : 'Photo Zoomée (dégât)',
            de: options.firstShot ? 'Gezoomtes Foto (Teil)' : 'Close Up (Schaden)',
          },
          created_at: expect.any(String),
        },
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.picture.mimetype);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      expect(ky.get).toHaveBeenCalledWith(options.picture.uri);
      const blob = await (ky.get as jest.Mock).mock.results[0].value.blob();
      const prefix = options.firstShot ? 'closeup-part' : 'closeup-damage';
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [blob],
        expect.stringMatching(new RegExp(`${prefix}-${options.inspectionId}-\\d{13}.${filetype}`)),
        { type: filetype },
      );
    });
  });
});
