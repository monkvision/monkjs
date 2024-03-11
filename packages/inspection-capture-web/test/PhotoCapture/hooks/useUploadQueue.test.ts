import { LoadingState, useQueue } from '@monkvision/common';
import { renderHook } from '@testing-library/react-hooks';
import {
  AddDamage1stShotPictureUpload,
  AddDamage2ndShotPictureUpload,
  PhotoCaptureMode,
  SightPictureUpload,
  UploadQueueParams,
  useUploadQueue,
} from '../../../src/PhotoCapture/hooks';
import { ImageType, TaskName } from '@monkvision/types';
import { useMonkApi } from '@monkvision/network';
import { TransactionStatus, useMonitoring } from '@monkvision/monitoring';
import { act } from '@testing-library/react';
import {
  InternalPhotoCaptureMonitoringConfig,
  UploadMeasurement,
} from '../../../src/PhotoCapture/monitoring';

const monitoring = {
  transaction: {
    startMeasurement: jest.fn(),
    stopMeasurement: jest.fn(),
    setMeasurement: jest.fn(),
  },
  tags: { testTagName: 'testTagValue' },
  data: { testDataKey: 'testDataValue' },
} as unknown as InternalPhotoCaptureMonitoringConfig;

const upload: SightPictureUpload = {
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

function createParams(): UploadQueueParams {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: { apiDomain: 'test-api-domain', authToken: 'test-auth-token' },
    loading: { onError: jest.fn() } as unknown as LoadingState,
    compliances: { iqa: false },
    monitoring,
  };
}

describe('useUploadQueue hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a queue created using the useQueue hook with the proper options', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(useUploadQueue, { initialProps });

    expect(useQueue).toHaveBeenCalledWith(expect.anything(), {
      maxProcessingItems: 5,
      storeFailedItems: true,
    });
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

      await process(upload);

      expect(addImageMock).toHaveBeenCalledWith({
        type: ImageType.BEAUTY_SHOT,
        picture: upload.picture,
        sightId: upload.sightId,
        tasks: upload.tasks,
        compliances: initialProps.compliances,
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
        type: ImageType.CLOSE_UP,
        picture: upload1.picture,
        siblingKey: expect.any(String),
        firstShot: true,
        compliances: initialProps.compliances,
        inspectionId: initialProps.inspectionId,
      });
      const { siblingKey } = addImageMock.mock.calls[0][0];

      addImageMock.mockClear();
      const upload2: AddDamage2ndShotPictureUpload = {
        mode: PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT,
        picture: {
          uri: 'test-monk-uri-2',
          mimetype: 'test-mimetype-2',
          height: 12342,
          width: 45672,
        },
      };
      await process(upload2);

      expect(addImageMock).toHaveBeenCalledWith({
        type: ImageType.CLOSE_UP,
        picture: upload2.picture,
        siblingKey,
        firstShot: false,
        compliances: initialProps.compliances,
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

      await expect(
        process({
          mode: PhotoCaptureMode.SIGHT,
          picture: {
            uri: 'test-monk-uri',
            mimetype: 'test-mimetype',
            height: 1234,
            width: 4567,
          },
          sightId: 'test-sight-id',
          tasks: [TaskName.IMAGES_OCR],
        }),
      ).rejects.toBe(err);
      expect(handleErrorMock).toHaveBeenCalledWith(err);
      expect(initialProps.loading.onError).toHaveBeenCalledWith(err);

      unmount();
    });

    it('should start and stop the Upload measurement', async () => {
      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await process(upload);

      expect(monitoring?.transaction?.startMeasurement).toHaveBeenCalledWith(
        UploadMeasurement.operation,
        {
          data: monitoring.data,
          description: UploadMeasurement.description,
          tags: {
            [UploadMeasurement.pictureDimensionTagName]: `${upload.picture.width}x${upload.picture.height}`,
            [UploadMeasurement.pictureFormatTagName]: upload.picture.mimetype,
            [UploadMeasurement.pictureModeTagName]: upload.mode,
            ...(monitoring.tags ?? {}),
          },
        },
      );

      expect(monitoring?.transaction?.stopMeasurement).toHaveBeenCalledWith(
        UploadMeasurement.operation,
        TransactionStatus.OK,
      );

      unmount();
    });

    it('should stop the Upload measurement with the ERROR status if the addImage fails', async () => {
      const err = new Error('test');
      (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
        addImage: jest.fn(() => Promise.reject(err)),
      }));

      const initialProps = createParams();
      const { unmount } = renderHook(useUploadQueue, { initialProps });
      const process = (useQueue as jest.Mock).mock.calls[0][0];

      await expect(process(upload)).rejects.toBe(err);

      expect(monitoring.transaction?.stopMeasurement).toHaveBeenCalledWith(
        UploadMeasurement.operation,
        TransactionStatus.UNKNOWN_ERROR,
      );
      unmount();
    });
  });
});
