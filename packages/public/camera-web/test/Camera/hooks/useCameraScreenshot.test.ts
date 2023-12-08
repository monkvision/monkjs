jest.mock('../../../src/Camera/hooks/utils/getCanvasHandle', () => ({
  getCanvasHandle: jest.fn(() => ({
    context: {
      drawImage: jest.fn(),
      getImageData: jest.fn(() => ({ data: [0, 2, 3, 23, 45, 123] })),
    },
  })),
}));

import { TransactionStatus } from '@monkvision/monitoring';
import { renderHook } from '@testing-library/react-hooks';
import { RefObject } from 'react';
import { getCanvasHandle } from '../../../src/Camera/hooks/utils';
import { useCameraScreenshot } from '../../../src/Camera/hooks';
import { ScreenshotMeasurement, ScreenshotSizeMeasurement } from '../../../src/Camera/monitoring';
import { createMockInternalMonitoringConfig } from '../../mocks';

const monitoringMock = createMockInternalMonitoringConfig();

const videoRef = { current: { test: 'test' } } as unknown as RefObject<HTMLVideoElement>;
const canvasRef = {} as RefObject<HTMLCanvasElement>;
const dimensions = { width: 99, height: 123 };

describe('useCameraScreenshot hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the canvasRef', () => {
    const { result, unmount } = renderHook(useCameraScreenshot, {
      initialProps: { videoRef, canvasRef, dimensions },
    });

    expect(result.current.canvasRef).toBe(canvasRef);
    unmount();
  });

  describe('takeScreenshot function', () => {
    it('should draw the image and return the image data', () => {
      const getCanvasHandleMock = getCanvasHandle as jest.Mock;
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef, canvasRef, dimensions },
      });
      const imageData = result.current.takeScreenshot(monitoringMock);

      expect(getCanvasHandleMock).toHaveBeenCalledWith(canvasRef, expect.anything());
      const { context } = getCanvasHandleMock.mock.results[0].value;
      expect(context.drawImage).toHaveBeenCalledWith(
        videoRef.current,
        0,
        0,
        dimensions.width,
        dimensions.height,
      );
      expect(context.getImageData).toHaveBeenCalledWith(0, 0, dimensions.width, dimensions.height);
      expect(imageData).toEqual(context.getImageData());
      unmount();
    });

    it('should throw if the dimensions are not defined', () => {
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef, canvasRef, dimensions: null },
      });

      expect(() => result.current.takeScreenshot(monitoringMock)).toThrowError();
      unmount();
    });

    it('should throw if the video ref is null', () => {
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef: { current: null }, canvasRef, dimensions },
      });

      expect(() => result.current.takeScreenshot(monitoringMock)).toThrowError();
      unmount();
    });

    it('should start the screenshot measurement with the proper config', () => {
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef, canvasRef, dimensions },
      });
      result.current.takeScreenshot(monitoringMock);

      expect(monitoringMock.transaction?.startMeasurement).toHaveBeenCalledWith(
        ScreenshotMeasurement.operation,
        {
          data: monitoringMock.data,
          tags: {
            [ScreenshotMeasurement.outputResolutionTagName]: `${dimensions.width}x${dimensions.height}`,
            ...(monitoringMock.tags ?? {}),
          },
          description: ScreenshotMeasurement.description,
        },
      );
      unmount();
    });

    it('should stop the screenshot measurement', () => {
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef, canvasRef, dimensions },
      });
      result.current.takeScreenshot(monitoringMock);

      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        ScreenshotMeasurement.operation,
        TransactionStatus.OK,
      );
      unmount();
    });

    it('should stop the screenshot measurement in error when the getCanvasHandle fails', () => {
      const error = new Error('test');
      (getCanvasHandle as jest.Mock).mockImplementationOnce((_, onError) => {
        onError();
        throw error;
      });
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef, canvasRef, dimensions },
      });
      try {
        result.current.takeScreenshot(monitoringMock);
      } catch (err) {
        if (err !== error) {
          throw err;
        }
      }

      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        ScreenshotMeasurement.operation,
        TransactionStatus.UNKNOWN_ERROR,
      );
      unmount();
    });

    it('should stop the screenshot measurement in error when the dimensions are null', () => {
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef, canvasRef, dimensions: null },
      });
      try {
        result.current.takeScreenshot(monitoringMock);
      } catch (err) {
        /* empty */
      }

      expect(() => result.current.takeScreenshot(monitoringMock)).toThrowError();
      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        ScreenshotMeasurement.operation,
        TransactionStatus.UNKNOWN_ERROR,
      );
      unmount();
    });

    it('should stop the screenshot measurement in error when the video ref is null', () => {
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef: { current: null }, canvasRef, dimensions },
      });
      try {
        result.current.takeScreenshot(monitoringMock);
      } catch (err) {
        /* empty */
      }

      expect(() => result.current.takeScreenshot(monitoringMock)).toThrowError();
      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        ScreenshotMeasurement.operation,
        TransactionStatus.UNKNOWN_ERROR,
      );
      unmount();
    });

    it('should set the ScreenshotSize measurement', () => {
      const { result, unmount } = renderHook(useCameraScreenshot, {
        initialProps: { videoRef, canvasRef, dimensions },
      });
      result.current.takeScreenshot(monitoringMock);

      expect(monitoringMock.transaction?.setMeasurement).toHaveBeenCalledWith(
        ScreenshotSizeMeasurement.name,
        (getCanvasHandle as jest.Mock)().context.getImageData().data.length,
        'byte',
      );
      unmount();
    });
  });
});
