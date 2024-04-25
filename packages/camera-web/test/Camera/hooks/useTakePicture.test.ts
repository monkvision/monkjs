import { TransactionStatus, useMonitoring } from '@monkvision/monitoring';
import { act } from '@testing-library/react';
import { MonkPicture } from '@monkvision/types';
import { renderHook } from '@testing-library/react-hooks';
import { useTakePicture } from '../../../src/Camera/hooks';
import { TakePictureTransaction } from '../../../src/Camera/monitoring';

const monitoring = {
  parentId: 'test-parent-id',
  tags: { testTagName: 'testTagValue' },
  data: { testDataKey: 'testDataValue' },
};

describe('useTakePicture hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should take the screenshot, compress it and return it', () => {
    const screenshot = { test: 'test' } as unknown as ImageData;
    const picture = { uri: 'test-uri' } as unknown as MonkPicture;
    const takeScreenshot = jest.fn(() => screenshot);
    const compress = jest.fn(() => picture);

    const { result, unmount } = renderHook(useTakePicture, {
      initialProps: { compress, takeScreenshot, monitoring },
    });

    act(() => {
      const pictureResult = result.current.takePicture();

      expect(takeScreenshot).toHaveBeenCalled();
      expect(compress).toHaveBeenCalledWith(screenshot, expect.anything());
      expect(pictureResult).toBe(picture);
    });

    unmount();
  });

  it('should call onPictureTaken when the picture is taken', () => {
    const screenshot = { test: 'test' } as unknown as ImageData;
    const picture = { uri: 'test-uri' } as unknown as MonkPicture;
    const takeScreenshot = jest.fn(() => screenshot);
    const compress = jest.fn(() => picture);
    const onPictureTaken = jest.fn();

    const { result, unmount } = renderHook(useTakePicture, {
      initialProps: { compress, takeScreenshot, onPictureTaken, monitoring },
    });

    act(() => {
      result.current.takePicture();

      expect(onPictureTaken).toHaveBeenCalledWith(picture);
    });

    unmount();
  });

  /*
   * For now, the picture taking process is synchronous, so the loading has no effect. But if at some point, the picture
   * taking process becomes asynchronous, we should add tests to verify that the loading is working properly.
   */

  it('should create the TakePicture transaction', () => {
    const takeScreenshot = jest.fn();
    const compress = jest.fn();

    const { result, unmount } = renderHook(useTakePicture, {
      initialProps: { compress, takeScreenshot, monitoring },
    });

    act(() => {
      result.current.takePicture();

      const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
        .createTransaction;
      expect(createTransactionMock).toHaveBeenCalledWith({
        ...TakePictureTransaction,
        ...monitoring,
      });
    });

    unmount();
  });

  it('should stop the TakePicture transaction', () => {
    const takeScreenshot = jest.fn();
    const compress = jest.fn();

    const { result, unmount } = renderHook(useTakePicture, {
      initialProps: { compress, takeScreenshot, monitoring },
    });

    act(() => {
      result.current.takePicture();

      const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
        .createTransaction;
      const transactionMock = createTransactionMock.mock.results[0].value;
      expect(transactionMock.finish).toHaveBeenCalled();
      expect([undefined, TransactionStatus.OK]).toContain(transactionMock.finish.mock.calls[0][0]);
    });

    unmount();
  });

  it('should pass the child monitoring config to the compress and takeScreenshot functions', () => {
    const takeScreenshot = jest.fn();
    const compress = jest.fn();

    const { result, unmount } = renderHook(useTakePicture, {
      initialProps: { compress, takeScreenshot, monitoring },
    });

    act(() => {
      result.current.takePicture();

      const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
        .createTransaction;
      const transactionMock = createTransactionMock.mock.results[0].value;
      const childMonitoring = {
        transaction: transactionMock,
        data: monitoring?.data,
        tags: monitoring?.tags,
      };
      expect(takeScreenshot).toHaveBeenCalledWith(childMonitoring);
      expect(compress.mock.calls[0][1]).toEqual(childMonitoring);
    });

    unmount();
  });
});
