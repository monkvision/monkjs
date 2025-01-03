jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  getFileExtensions: jest.fn(() => ['aaa', 'bbb']),
}));
jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/image/mappers', () => ({
  mapApiImage: jest.fn(() => ({ test: 'hello' })),
}));

import { labels, sights } from '@monkvision/sights';
import ky from 'ky';
import { ComplianceIssue, ImageStatus, ImageSubtype, ImageType, TaskName } from '@monkvision/types';
import { getFileExtensions, MonkActionType } from '@monkvision/common';
import { getDefaultOptions } from '../../../src/api/config';
import {
  Add2ShotCloseUpImageOptions,
  AddBeautyShotImageOptions,
  addImage,
  AddVideoFrameOptions,
  AddVideoManualPhotoOptions,
  ImageUploadType,
} from '../../../src/api/image';
import { mapApiImage } from '../../../src/api/image/mappers';

const apiConfig = {
  apiDomain: 'apiDomain',
  authToken: 'authToken',
  thumbnailDomain: 'thumbnailDomain',
};

function createBeautyShotImageOptions(): AddBeautyShotImageOptions {
  return {
    uploadType: ImageUploadType.BEAUTY_SHOT,
    picture: {
      blob: { size: 424 } as Blob,
      uri: 'test-uri',
      height: 720,
      width: 1280,
      mimetype: 'image/jpeg',
    },
    inspectionId: 'test-inspection-id',
    sightId: 'test-sight-1',
    tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS, TaskName.HUMAN_IN_THE_LOOP],
    compliance: {
      enableCompliance: true,
      complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    },
    useThumbnailCaching: true,
  };
}

function createCloseUpImageOptions(): Add2ShotCloseUpImageOptions {
  return {
    uploadType: ImageUploadType.CLOSE_UP_2_SHOT,
    picture: {
      blob: { size: 424 } as Blob,
      uri: 'test-uri',
      height: 720,
      width: 1280,
      mimetype: 'image/jpeg',
    },
    inspectionId: 'test-inspection-id',
    siblingKey: 'test-sibling-key',
    firstShot: true,
    compliance: {
      enableCompliance: true,
      complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    },
    useThumbnailCaching: true,
  };
}

function createVideoFrameOptions(): AddVideoFrameOptions {
  return {
    uploadType: ImageUploadType.VIDEO_FRAME,
    picture: {
      blob: { size: 424 } as Blob,
      uri: 'test-uri',
      height: 720,
      width: 1280,
      mimetype: 'image/jpeg',
    },
    inspectionId: 'test-inspection-id',
    frameIndex: 12,
    timestamp: 2312,
  };
}

function createVideoManualPhotoOptions(): AddVideoManualPhotoOptions {
  return {
    uploadType: ImageUploadType.VIDEO_MANUAL_PHOTO,
    picture: {
      blob: { size: 424 } as Blob,
      uri: 'test-uri',
      height: 720,
      width: 1280,
      mimetype: 'image/jpeg',
    },
    inspectionId: 'test-inspection-id',
  };
}

describe('Image requests', () => {
  let fileMock: File;
  let fileConstructorSpy: jest.SpyInstance;

  beforeEach(() => {
    fileMock = { test: 'hello' } as unknown as File;
    fileConstructorSpy = jest.spyOn(global, 'File').mockImplementationOnce(() => fileMock);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addImage request', () => {
    it('should make a request to the proper URL', async () => {
      const options = createBeautyShotImageOptions();
      const dispatch = jest.fn();
      const result = await addImage(options, apiConfig, dispatch);
      const response = await (ky.post as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(mapApiImage).toHaveBeenCalledWith(
        body,
        options.inspectionId,
        apiConfig.thumbnailDomain,
        options.compliance,
      );
      const image = (mapApiImage as jest.Mock).mock.results[0].value;
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.post).toHaveBeenCalledWith(
        `inspections/${options.inspectionId}/images`,
        expect.objectContaining(getDefaultOptions(apiConfig)),
      );
      expect(result).toEqual({ image, response, body });
    });

    it('should properly update the state', async () => {
      const options = createBeautyShotImageOptions();
      const dispatch = jest.fn();
      const result = await addImage(options, apiConfig, dispatch);
      const response = await (ky.post as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(mapApiImage).toHaveBeenCalledWith(
        body,
        options.inspectionId,
        apiConfig.thumbnailDomain,
        options.compliance,
      );
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.CREATED_ONE_IMAGE,
        payload: {
          inspectionId: options.inspectionId,
          image: expect.objectContaining({
            id: expect.any(String),
            status: ImageStatus.UPLOADING,
          }),
        },
      });
      const localId = (dispatch as jest.Mock).mock.calls[0][0].payload.image.id;
      const image = (mapApiImage as jest.Mock).mock.results[0].value;
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.CREATED_ONE_IMAGE,
        payload: {
          inspectionId: options.inspectionId,
          image,
          localId,
        },
      });
      expect(result).toEqual({ image, response, body });
    });

    it('should properly update the state in case of upload error', async () => {
      const err = new Error('Hello');
      jest.spyOn(ky, 'post').mockImplementationOnce(() => {
        throw err;
      });
      const options = createBeautyShotImageOptions();
      const dispatch = jest.fn();
      await expect(addImage(options, apiConfig, dispatch)).rejects.toThrow(err);

      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.CREATED_ONE_IMAGE,
        payload: {
          inspectionId: options.inspectionId,
          image: expect.objectContaining({
            id: expect.any(String),
            status: ImageStatus.UPLOADING,
          }),
        },
      });
      const localId = (dispatch as jest.Mock).mock.calls[0][0].payload.image.id;
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.CREATED_ONE_IMAGE,
        payload: {
          inspectionId: options.inspectionId,
          image: expect.objectContaining({
            id: localId,
            status: ImageStatus.UPLOAD_ERROR,
          }),
        },
      });
    });

    it('should properly update the state in case of upload fail', async () => {
      const err = new Error('Failed to fetch');
      jest.spyOn(ky, 'post').mockImplementationOnce(() => {
        throw err;
      });
      const options = createBeautyShotImageOptions();
      const dispatch = jest.fn();
      await expect(addImage(options, apiConfig, dispatch)).rejects.toThrow(err);

      const localId = (dispatch as jest.Mock).mock.calls[0][0].payload.image.id;
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.CREATED_ONE_IMAGE,
        payload: {
          inspectionId: options.inspectionId,
          image: expect.objectContaining({
            id: localId,
            status: ImageStatus.UPLOAD_FAILED,
          }),
        },
      });
    });

    it('should properly update the state in case of upload timeout', async () => {
      const err = new Error('Ftest');
      err.name = 'TimeoutError';
      jest.spyOn(ky, 'post').mockImplementationOnce(() => {
        throw err;
      });
      const options = createBeautyShotImageOptions();
      const dispatch = jest.fn();
      await expect(addImage(options, apiConfig, dispatch)).rejects.toThrow(err);

      const localId = (dispatch as jest.Mock).mock.calls[0][0].payload.image.id;
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.CREATED_ONE_IMAGE,
        payload: {
          inspectionId: options.inspectionId,
          image: expect.objectContaining({
            id: localId,
            status: ImageStatus.UPLOAD_FAILED,
          }),
        },
      });
    });

    it('should properly create the formdata for a beautyshot', async () => {
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
        image_type: ImageType.BEAUTY_SHOT,
        tasks: [
          ...options.tasks.filter((task) => task !== TaskName.HUMAN_IN_THE_LOOP),
          {
            name: TaskName.COMPLIANCES,
            image_details: { sight_id: options.sightId },
          },
          {
            name: TaskName.HUMAN_IN_THE_LOOP,
            image_details: { sight_label: sights[options.sightId].label },
          },
        ],
        additional_data: {
          sight_id: options.sightId,
          created_at: expect.any(String),
          ...(sights[options.sightId] ? { label: labels[sights[options.sightId].label] } : {}),
        },
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.picture.mimetype);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [options.picture.blob],
        expect.stringMatching(
          new RegExp(`${options.sightId}-${options.inspectionId}-\\d{13}.${filetype}`),
        ),
        { type: filetype },
      );
    });

    it('should properly create the formdata for a closeup', async () => {
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
        image_type: ImageType.CLOSE_UP,
        image_subtype: options.firstShot
          ? ImageSubtype.CLOSE_UP_PART
          : ImageSubtype.CLOSE_UP_DAMAGE,
        image_sibling_key: options.siblingKey,
        tasks: [TaskName.DAMAGE_DETECTION, { name: TaskName.COMPLIANCES }],
        additional_data: {
          label: {
            en: options.firstShot ? 'Close Up (part)' : 'Close Up (damage)',
            fr: options.firstShot ? 'Photo Zoomée (partie)' : 'Photo Zoomée (dégât)',
            de: options.firstShot ? 'Gezoomtes Foto (Teil)' : 'Close Up (Schaden)',
            nl: options.firstShot ? 'Nabij (onderdeel)' : 'Nabij (schade)',
          },
          created_at: expect.any(String),
        },
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.picture.mimetype);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      const prefix = options.firstShot ? 'closeup-part' : 'closeup-damage';
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [options.picture.blob],
        expect.stringMatching(new RegExp(`${prefix}-${options.inspectionId}-\\d{13}.${filetype}`)),
        { type: filetype },
      );
    });

    it('should properly create the formdata for a video frame', async () => {
      const options = createVideoFrameOptions();
      await addImage(options, apiConfig);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string)).toEqual({
        acquisition: {
          strategy: 'upload_multipart_form_keys',
          file_key: 'image',
        },
        tasks: [TaskName.DAMAGE_DETECTION],
        additional_data: {
          label: {
            en: `Video Frame ${options.frameIndex}`,
            fr: `Trame Vidéo ${options.frameIndex}`,
            de: `Videobild ${options.frameIndex}`,
            nl: `Videoframe ${options.frameIndex}`,
          },
          created_at: expect.any(String),
          frame_index: options.frameIndex,
          timestamp: options.timestamp,
        },
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.picture.mimetype);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [options.picture.blob],
        `video-frame-${options.frameIndex}.${filetype}`,
        { type: filetype },
      );
    });

    it('should properly create the formdata for a video manual photo', async () => {
      const options = createVideoManualPhotoOptions();
      await addImage(options, apiConfig);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string)).toEqual({
        acquisition: {
          strategy: 'upload_multipart_form_keys',
          file_key: 'image',
        },
        tasks: [TaskName.DAMAGE_DETECTION],
        additional_data: {
          label: {
            en: `Video Manual Photo`,
            fr: `Photo Manuelle Vidéo`,
            de: `Foto Manuell Video`,
            nl: `Foto-handleiding Video`,
          },
          created_at: expect.any(String),
        },
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.picture.mimetype);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [options.picture.blob],
        expect.stringMatching(new RegExp(`video-manual-photo-\\d{13}.${filetype}`)),
        { type: filetype },
      );
    });

    it('should properly set up the live compliance', async () => {
      const options = createBeautyShotImageOptions();
      options.compliance = { enableCompliance: true, useLiveCompliance: true };
      await addImage(options, apiConfig);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string).tasks).toContainEqual(
        expect.objectContaining({
          name: 'compliances',
          wait_for_result: true,
        }),
      );
    });

    it('should not enable live compliance if compliance is not enabled', async () => {
      const options = createBeautyShotImageOptions();
      options.compliance = { enableCompliance: false, useLiveCompliance: true };
      await addImage(options, apiConfig);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string).tasks).toContainEqual(
        expect.objectContaining({
          name: 'compliances',
          wait_for_result: false,
        }),
      );
    });

    it('should remove the compliances task from the tasks of beautyshots', async () => {
      const options = createBeautyShotImageOptions();
      options.tasks.push(TaskName.COMPLIANCES);
      await addImage(options, apiConfig);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string).tasks).not.toContain(TaskName.COMPLIANCES);
    });

    it('should fetch thumbnail image for beautyshots or closeup if thumbnail enabled', async () => {
      const options = createBeautyShotImageOptions();
      const imageMock = { thumbnailPath: 'thumbnailPath' };
      options.tasks.push(TaskName.COMPLIANCES);
      (mapApiImage as jest.Mock).mockImplementationOnce(() => imageMock);
      await addImage(options, apiConfig);

      expect(ky.get).toHaveBeenCalled();
      expect(ky.get).toHaveBeenCalledWith(imageMock.thumbnailPath);
    });

    it('should not fetch thumbnail image if thumbnail disabled', async () => {
      const options = createBeautyShotImageOptions();
      const imageMock = { thumbnailPath: 'thumbnailPath' };
      options.tasks.push(TaskName.COMPLIANCES);
      (mapApiImage as jest.Mock).mockImplementationOnce(() => imageMock);
      await addImage({ ...options, useThumbnailCaching: false }, apiConfig);

      expect(ky.get).not.toHaveBeenCalled();
    });
  });
});
