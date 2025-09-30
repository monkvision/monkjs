import { TransactionStatus, useMonitoring } from '@monkvision/monitoring';
import { act, waitFor, renderHook } from '@testing-library/react';
import { MonkPicture } from '@monkvision/types';
import { useTakePicture, UseTakePictureParams } from '../../../src/Camera/hooks';
import { TakePictureTransaction } from '../../../src/Camera/monitoring';
import { createFakePromise } from '@monkvision/test-utils';

function createParams(): UseTakePictureParams & { screenshot: ImageData; picture: MonkPicture } {
  const screenshot = { test: 'test' } as unknown as ImageData;
  const picture = { uri: 'test-uri' } as unknown as MonkPicture;
  return {
    screenshot,
    picture,
    takeScreenshot: jest.fn(() => screenshot),
    compress: jest.fn(() => Promise.resolve(picture)),
    onPictureTaken: jest.fn(),
    monitoring: {
      parentId: 'test-parent-id',
      tags: { testTagName: 'testTagValue' },
      data: { testDataKey: 'testDataValue' },
    },
    availableCameraDevices: [
      { label: 'test-uno', deviceId: '1' },
      { label: 'test-dos', deviceId: '2' },
    ],
    selectedCameraDeviceId: '2',
  } as unknown as UseTakePictureParams & { screenshot: ImageData; picture: MonkPicture };
}

describe('useTakePicture hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should take the screenshot, compress it and return it', async () => {
    const initialProps = createParams();

    const { result, unmount } = renderHook(useTakePicture, { initialProps });

    await act(async () => {
      const pictureResult = await result.current.takePicture();

      expect(initialProps.takeScreenshot).toHaveBeenCalled();
      expect(initialProps.compress).toHaveBeenCalledWith(
        initialProps.screenshot,
        expect.anything(),
      );
      expect(pictureResult).toBe(initialProps.picture);
    });

    unmount();
  });

  it('should call onPictureTaken when the picture is taken', async () => {
    const initialProps = createParams();

    const { result, unmount } = renderHook(useTakePicture, { initialProps });

    await act(async () => {
      await result.current.takePicture();

      expect(initialProps.onPictureTaken).toHaveBeenCalledWith(initialProps.picture);
    });

    unmount();
  });

  it('should put the camera into loading while the picture is being taken', async () => {
    const promise = createFakePromise();
    const initialProps = createParams();
    initialProps.compress = jest.fn(() => promise);

    const { result, unmount } = renderHook(useTakePicture, { initialProps });

    expect(result.current.isLoading).toBe(false);
    act(() => {
      result.current.takePicture();
    });
    expect(result.current.isLoading).toBe(true);
    await act(async () => {
      promise.resolve(initialProps.picture);
      await promise;
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    unmount();
  });

  it('should create the TakePicture transaction with the proper params', async () => {
    const initialProps = createParams();

    const { result, unmount } = renderHook(useTakePicture, { initialProps });

    await act(async () => {
      await result.current.takePicture();

      const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
        .createTransaction;
      expect(createTransactionMock).toHaveBeenCalledWith({
        ...TakePictureTransaction,
        ...initialProps.monitoring,
        data: {
          ...initialProps.monitoring?.data,
          availableCameras: ['test-uno (1)', 'test-dos (2)'],
          selectedCameraId: '2',
        },
      });
    });

    unmount();
  });

  it('should stop the TakePicture transaction', async () => {
    const initialProps = createParams();

    const { result, unmount } = renderHook(useTakePicture, { initialProps });

    await act(async () => {
      await result.current.takePicture();

      const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
        .createTransaction;
      const transactionMock = createTransactionMock.mock.results[0].value;
      expect(transactionMock.finish).toHaveBeenCalled();
      expect([undefined, TransactionStatus.OK]).toContain(transactionMock.finish.mock.calls[0][0]);
    });

    unmount();
  });

  it('should pass the child monitoring config to the compress and takeScreenshot functions', async () => {
    const initialProps = createParams();

    const { result, unmount } = renderHook(useTakePicture, { initialProps });

    await act(async () => {
      await result.current.takePicture();

      const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
        .createTransaction;
      const transactionMock = createTransactionMock.mock.results[0].value;
      const childMonitoring = {
        transaction: transactionMock,
        data: initialProps.monitoring?.data,
        tags: initialProps.monitoring?.tags,
      };
      expect(initialProps.takeScreenshot).toHaveBeenCalledWith(childMonitoring);
      expect((initialProps.compress as jest.Mock).mock.calls[0][1]).toEqual(childMonitoring);
    });

    unmount();
  });
});
