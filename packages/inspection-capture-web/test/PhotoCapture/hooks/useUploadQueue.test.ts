import { useQueue } from '@monkvision/common';
import { renderHook } from '@testing-library/react-hooks';
import {
  AddDamage1stShotPictureUpload,
  AddDamage2ndShotPictureUpload,
  PhotoCaptureMode,
  UploadQueueParams,
  useUploadQueue,
} from '../../../src/PhotoCapture/hooks';
import { ComplianceIssue, TaskName } from '@monkvision/types';
import { ImageUploadType, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { act } from '@testing-library/react';

function createParams(): UploadQueueParams {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    complianceOptions: {
      enableCompliance: true,
      complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
      enableCompliancePerSight: ['test-sight'],
      complianceIssuesPerSight: { test: [ComplianceIssue.OVEREXPOSURE] },
      useLiveCompliance: true,
    },
    eventHandlers: [
      {
        onUploadSuccess: jest.fn(),
        onUploadTimeout: jest.fn(),
      },
      {
        onUploadSuccess: jest.fn(),
        onUploadTimeout: jest.fn(),
      },
    ],
  };
}

const defaultUploadOptions = {
  mode: PhotoCaptureMode.SIGHT,
  picture: {
    uri: 'test-monk-uri',
    mimetype: 'test-mimetype',
    height: 1234,
    width: 4567,
  },
  sightId: 'test-sight-id',
  tasks: [TaskName.IMAGES_OCR],
};

jest.useFakeTimers();

describe('useUploadQueue hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a queue created using the useQueue hook with the proper options', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(useUploadQueue, { initialProps });

    expect(useQueue).toHaveBeenCalledWith(expect.any(Function));
    const queue = (useQueue as jest.Mock).mock.results[0].value;
    expect(result.current).toBe(queue);

    unmount();
  });

  describe('processing function', () => {
    it('should properly add a sight image', async () => {
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });
      expect(useMonkApi).toHaveBeenCalled();
      const addImageMock = (useMonkApi as jest.Mock).mock.results[0].value.addImage;
      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await process(defaultUploadOptions);

      expect(addImageMock).toHaveBeenCalledWith({
        uploadType: ImageUploadType.BEAUTY_SHOT,
        picture: defaultUploadOptions.picture,
        sightId: defaultUploadOptions.sightId,
        tasks: defaultUploadOptions.tasks,
        compliance: initialProps.complianceOptions,
        inspectionId: initialProps.inspectionId,
        useThumbnailCaching: true,
      });

      unmount();
    });

    it('should properly add a sight image with additional tasks', async () => {
      const initialProps = createParams();
      const tasks = [TaskName.DAMAGE_DETECTION, TaskName.IMAGE_EDITING];
      initialProps.additionalTasks = [TaskName.INSPECTION_PDF, TaskName.IMAGE_EDITING];
      const { unmount } = renderHook(useUploadQueue, { initialProps });
      expect(useMonkApi).toHaveBeenCalled();
      const addImageMock = (useMonkApi as jest.Mock).mock.results[0].value.addImage;
      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await process({ ...defaultUploadOptions, tasks });

      expect(addImageMock).toHaveBeenCalledWith({
        uploadType: ImageUploadType.BEAUTY_SHOT,
        picture: defaultUploadOptions.picture,
        sightId: defaultUploadOptions.sightId,
        useThumbnailCaching: true,
        tasks: expect.arrayContaining([
          TaskName.DAMAGE_DETECTION,
          TaskName.IMAGE_EDITING,
          TaskName.INSPECTION_PDF,
        ]),
        compliance: initialProps.complianceOptions,
        inspectionId: initialProps.inspectionId,
      });

      unmount();
    });

    it('should properly add an add damage images', async () => {
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });
      expect(useMonkApi).toHaveBeenCalled();
      const addImageMock = (useMonkApi as jest.Mock).mock.results[0].value.addImage;
      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      const upload1: AddDamage1stShotPictureUpload = {
        mode: PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT,
        picture: {
          blob: { size: 42 } as Blob,
          uri: 'test-monk-uri-1',
          mimetype: 'test-mimetype-1',
          height: 12341,
          width: 45671,
        },
      };
      await act(async () => {
        await process(upload1);
      });
      expect(addImageMock).toHaveBeenCalledWith({
        uploadType: ImageUploadType.CLOSE_UP_2_SHOT,
        picture: upload1.picture,
        siblingKey: expect.any(String),
        useThumbnailCaching: true,
        firstShot: true,
        compliance: initialProps.complianceOptions,
        inspectionId: initialProps.inspectionId,
      });
      const { siblingKey } = addImageMock.mock.calls[0][0];

      addImageMock.mockClear();
      const upload2: AddDamage2ndShotPictureUpload = {
        mode: PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT,
        picture: {
          blob: { size: 42 } as Blob,
          uri: 'test-monk-uri-2',
          mimetype: 'test-mimetype-2',
          height: 12342,
          width: 45672,
        },
      };
      await process(upload2);

      expect(addImageMock).toHaveBeenCalledWith({
        uploadType: ImageUploadType.CLOSE_UP_2_SHOT,
        picture: upload2.picture,
        siblingKey,
        useThumbnailCaching: true,
        firstShot: false,
        compliance: initialProps.complianceOptions,
        inspectionId: initialProps.inspectionId,
      });

      addImageMock.mockClear();
      await act(async () => {
        await process({
          mode: PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT,
          picture: {
            uri: 'test-monk-uri-3',
            mimetype: 'test-mimetype-3',
            height: 12343,
            width: 45673,
          },
        });
      });
      const newSiblingKey = addImageMock.mock.calls[0][0].siblingKey;
      expect(newSiblingKey).not.toEqual(siblingKey);

      unmount();
    });

    it('should properly handle api errors', async () => {
      const err = new Error('test');
      (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
        addImage: jest.fn(() => Promise.reject(err)),
      }));
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });

      expect(useMonitoring).toHaveBeenCalled();
      const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;
      expect(useMonkApi).toHaveBeenCalled();
      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await expect(process(defaultUploadOptions)).rejects.toBe(err);
      expect(handleErrorMock).toHaveBeenCalledWith(err);

      unmount();
    });

    it('should call the onUploadSuccess with the proper duration after a successful upload', async () => {
      const durationMs = 1234;
      (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
        addImage: jest.fn(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(null), durationMs);
            }),
        ),
      }));
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });

      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      const promise = process(defaultUploadOptions);
      jest.advanceTimersByTime(durationMs);
      await promise;
      initialProps.eventHandlers?.forEach((eventHandlers) => {
        expect(eventHandlers.onUploadSuccess).toHaveBeenCalledWith(durationMs);
      });

      unmount();
    });

    it('should call the onUploadTimeout if the API call times out', async () => {
      const err = new Error('test');
      err.name = 'TimeoutError';
      (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
        addImage: jest.fn(() => Promise.reject(err)),
      }));
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });

      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await expect(process(defaultUploadOptions)).rejects.toBe(err);
      initialProps.eventHandlers?.forEach((eventHandlers) => {
        expect(eventHandlers.onUploadTimeout).toHaveBeenCalledWith();
      });

      unmount();
    });

    it('should call the onUploadTimeout if the API call fails because of no connection', async () => {
      const err = new Error('test');
      err.message = 'Failed to fetch';
      (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
        addImage: jest.fn(() => Promise.reject(err)),
      }));
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });

      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await expect(process(defaultUploadOptions)).rejects.toBe(err);
      initialProps.eventHandlers?.forEach((eventHandlers) => {
        expect(eventHandlers.onUploadTimeout).toHaveBeenCalledWith();
      });

      unmount();
    });

    it('should call the onUploadTimeout if the error is not a timeout', async () => {
      const err = new Error('test');
      (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
        addImage: jest.fn(() => Promise.reject(err)),
      }));
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });

      expect(useQueue).toHaveBeenCalled();
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await expect(process(defaultUploadOptions)).rejects.toBe(err);
      initialProps.eventHandlers?.forEach((eventHandlers) => {
        expect(eventHandlers.onUploadTimeout).not.toHaveBeenCalledWith();
      });

      unmount();
    });
  });
});
