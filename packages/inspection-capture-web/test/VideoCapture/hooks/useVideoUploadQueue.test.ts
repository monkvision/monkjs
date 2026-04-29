import { act, renderHook } from '@testing-library/react';
import { getInspectionImages, useMonkState, useQueue } from '@monkvision/common';
import { MonkPicture } from '@monkvision/types';
import { ImageUploadType, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { useVideoUploadQueue, VideoUploadQueueParams } from '../../../src/VideoCapture/hooks';

function createProps(): VideoUploadQueueParams {
  return {
    apiConfig: {
      apiDomain: 'test-api-domain',
      thumbnailDomain: 'test-thumbnail-domain',
      authToken: 'auth-token',
    },
    inspectionId: 'inspection-test-id',
    maxRetryCount: 3,
    alpha: 123.7,
  };
}

jest.useFakeTimers();

describe('useVideoUploadQueue hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should push items to the queue with the proper params', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    expect(useQueue).toHaveBeenCalled();
    let { push } = (useQueue as jest.Mock).mock.results[0].value;

    expect(push).not.toHaveBeenCalled();
    const picture1 = { uri: 'test-uri-1' } as unknown as MonkPicture;
    act(() => {
      result.current.onFrameSelected(picture1);
    });
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        picture: picture1,
        frameIndex: 0,
        timestamp: 0,
        alpha: 124,
      }),
    );

    const time = 5491;
    jest.advanceTimersByTime(time);
    rerender();
    push = (useQueue as jest.Mock).mock.results[1].value.push;

    expect(push).not.toHaveBeenCalled();
    const picture2 = { uri: 'test-uri-2' } as unknown as MonkPicture;
    act(() => {
      result.current.onFrameSelected(picture2);
    });
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        picture: picture2,
        frameIndex: 1,
        timestamp: time,
        alpha: 124,
      }),
    );

    unmount();
  });

  it('should upload the image to the API when adding the item to the queue', () => {
    const initialProps = createProps();
    const { unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    expect(useMonkApi).toHaveBeenCalledWith(initialProps.apiConfig);
    const { addImage } = (useMonkApi as jest.Mock).mock.results[0].value;

    expect(useQueue).toHaveBeenCalledWith(expect.any(Function), expect.anything());
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];

    expect(addImage).not.toHaveBeenCalled();
    const upload = {
      picture: { uri: 'test-uri-1' },
      frameIndex: 12,
      timestamp: 123,
      retryCount: 0,
      alpha: 45,
    };
    processingFunction(upload);
    expect(addImage).toHaveBeenCalledWith({
      uploadType: ImageUploadType.VIDEO_FRAME,
      inspectionId: initialProps.inspectionId,
      picture: upload.picture,
      frameIndex: upload.frameIndex,
      timestamp: upload.timestamp,
      alpha: upload.alpha,
    });

    unmount();
  });

  it('should retry the failed items until they reach the retry limit', () => {
    const initialProps = createProps();
    const { unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    expect(useQueue).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        storeFailedItems: true,
        onItemFail: expect.any(Function),
      }),
    );
    const { push } = (useQueue as jest.Mock).mock.results[0].value;
    const { onItemFail } = (useQueue as jest.Mock).mock.calls[0][1];
    const upload = {
      picture: { uri: 'test-uri-1' },
      frameIndex: 12,
      timestamp: 123,
      retryCount: 0,
    };

    let retry = 0;
    while (retry < initialProps.maxRetryCount) {
      expect(push).not.toHaveBeenCalled();
      onItemFail(upload);
      expect(push).toHaveBeenCalledWith(
        expect.objectContaining({
          picture: upload.picture,
          frameIndex: upload.frameIndex,
          timestamp: upload.timestamp,
        }),
      );
      push.mockClear();
      retry += 1;
    }
    onItemFail(upload);
    expect(push).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the uploaded frames and the total uploading frames', () => {
    const totalItems = 2345;
    const processingCount = 123;
    (useQueue as jest.Mock).mockImplementationOnce(() => ({
      push: jest.fn(),
      clear: jest.fn(),
      totalItems,
      processingCount,
    }));
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    expect(result.current.uploadedFrames).toEqual(totalItems - processingCount);
    expect(result.current.totalUploadingFrames).toEqual(totalItems);

    unmount();
  });

  it('should round the alpha value in the upload objects', () => {
    const initialProps = { ...createProps(), alpha: 45.6 };
    const { result, unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    const { push } = (useQueue as jest.Mock).mock.results[0].value;

    const picture = { uri: 'test-uri-round' } as unknown as MonkPicture;
    act(() => {
      result.current.onFrameSelected(picture);
    });
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({
        alpha: 46,
      }),
    );

    unmount();
  });

  it('should clear the queue and delete inspection images on discard', () => {
    const images = [
      { id: 'img-1', inspectionId: 'inspection-test-id' },
      { id: 'img-2', inspectionId: 'inspection-test-id' },
      { id: 'img-3', inspectionId: 'inspection-test-id' },
    ];
    (useMonkState as jest.Mock).mockReturnValueOnce({
      state: { images },
      dispatch: jest.fn(),
    });
    const deleteImagesBulkMock = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockReturnValueOnce({
      addImage: jest.fn(() => Promise.resolve()),
      deleteImagesBulk: deleteImagesBulkMock,
    });
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    const { clear } = (useQueue as jest.Mock).mock.results[0].value;

    act(() => {
      result.current.discardUploadedImages();
    });

    expect(clear).toHaveBeenCalledWith(true);
    expect(deleteImagesBulkMock).toHaveBeenCalledWith({
      inspectionId: initialProps.inspectionId,
      imageIds: ['img-1', 'img-2', 'img-3'],
    });

    unmount();
  });

  it('should not call deleteImagesBulk when there are no inspection images', () => {
    (useMonkState as jest.Mock).mockReturnValueOnce({
      state: { images: [] },
      dispatch: jest.fn(),
    });
    const deleteImagesBulkMock = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockReturnValueOnce({
      addImage: jest.fn(() => Promise.resolve()),
      deleteImagesBulk: deleteImagesBulkMock,
    });
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    act(() => {
      result.current.discardUploadedImages();
    });

    expect(deleteImagesBulkMock).not.toHaveBeenCalled();

    unmount();
  });

  it('should report errors when deleteImagesBulk fails', async () => {
    const images = [{ id: 'img-1', inspectionId: 'inspection-test-id' }];
    (useMonkState as jest.Mock).mockReturnValueOnce({
      state: { images },
      dispatch: jest.fn(),
    });
    const error = new Error('bulk delete failed');
    const deleteImagesBulkMock = jest.fn(() => Promise.reject(error));
    (useMonkApi as jest.Mock).mockReturnValueOnce({
      addImage: jest.fn(() => Promise.resolve()),
      deleteImagesBulk: deleteImagesBulkMock,
    });
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    await act(async () => {
      result.current.discardUploadedImages();
      await jest.runAllTimersAsync();
    });

    const { handleError } = (useMonitoring as jest.Mock).mock.results[0].value;
    expect(handleError).toHaveBeenCalledWith(error);

    unmount();
  });

  it('should only delete images belonging to the current inspection', () => {
    const images = [
      { id: 'img-1', inspectionId: 'inspection-test-id' },
      { id: 'img-other', inspectionId: 'other-inspection-id' },
      { id: 'img-2', inspectionId: 'inspection-test-id' },
    ];
    (useMonkState as jest.Mock).mockReturnValueOnce({
      state: { images },
      dispatch: jest.fn(),
    });
    const deleteImagesBulkMock = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockReturnValueOnce({
      addImage: jest.fn(() => Promise.resolve()),
      deleteImagesBulk: deleteImagesBulkMock,
    });
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useVideoUploadQueue(initialProps));

    act(() => {
      result.current.discardUploadedImages();
    });

    expect(deleteImagesBulkMock).toHaveBeenCalledWith({
      inspectionId: initialProps.inspectionId,
      imageIds: ['img-1', 'img-2'],
    });

    unmount();
  });
});
