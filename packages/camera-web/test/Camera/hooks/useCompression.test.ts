jest.mock('../../../src/Camera/hooks/utils/getCanvasHandle', () => ({
  getCanvasHandle: jest.fn(() => ({
    canvas: { toDataURL: jest.fn(() => 'picture,test-url') },
    context: { putImageData: jest.fn() },
  })),
}));

Object.defineProperty(global.window, 'atob', {
  value: jest.fn(() => 'test-url-test-test'),
  configurable: true,
  writable: true,
});

import { TransactionStatus } from '@monkvision/monitoring';
import { renderHook } from '@testing-library/react-hooks';
import { RefObject } from 'react';
import { CompressionFormat, useCompression } from '../../../src/Camera/hooks';
import {
  CompressionMeasurement,
  CompressionSizeRatioMeasurement,
  PictureSizeMeasurement,
} from '../../../src/Camera/monitoring';
import { createMockInternalMonitoringConfig } from '../../mocks';

const { getCanvasHandle } = jest.requireActual('../../../src/Camera/hooks/utils');

const monitoringMock = createMockInternalMonitoringConfig();
const mockImageData = {
  width: 123,
  height: 456,
  data: [21, 34, 654, 123, 345],
} as unknown as ImageData;

describe('useCompression hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('compress function', () => {
    it('should compress images in JPEG', () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      const picture = result.current(mockImageData, monitoringMock);

      const canvasHandleMock = (getCanvasHandle as jest.Mock).mock.results[0].value;
      expect(getCanvasHandle).toHaveBeenCalledWith(canvasRef);
      expect(canvasHandleMock.context.putImageData).toHaveBeenCalledWith(mockImageData, 0, 0);
      expect(canvasHandleMock.canvas.toDataURL).toHaveBeenCalledWith(
        options.format,
        options.quality,
      );
      expect(picture).toEqual({
        uri: canvasHandleMock.canvas.toDataURL(),
        mimetype: options.format,
        width: mockImageData.width,
        height: mockImageData.height,
      });
      unmount();
    });

    it('should throw an error if the getCanvasHandle function fails', () => {
      const error = new Error('test');
      (getCanvasHandle as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      expect(() => result.current(mockImageData, monitoringMock)).toThrow(error);
      unmount();
    });

    it('should start the Compression measurement with the proper config', () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      result.current(mockImageData, monitoringMock);

      expect(monitoringMock.transaction?.startMeasurement).toHaveBeenCalledWith(
        CompressionMeasurement.operation,
        {
          data: monitoringMock.data,
          tags: {
            [CompressionMeasurement.formatTagName]: options.format,
            [CompressionMeasurement.qualityTagName]: options.quality,
            [CompressionMeasurement.dimensionsTagName]: `${mockImageData.width}x${mockImageData.height}`,
            ...(monitoringMock.tags ?? {}),
          },
          description: CompressionMeasurement.description,
        },
      );
      unmount();
    });

    it('should stop the Compression measurement with the OK status', () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      result.current(mockImageData, monitoringMock);

      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        CompressionMeasurement.operation,
        TransactionStatus.OK,
      );
      unmount();
    });

    it('should stop the Compression measurement with the ERROR status if the getCanvasHandle fails', () => {
      const error = new Error('test');
      (getCanvasHandle as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      try {
        result.current(mockImageData, monitoringMock);
      } catch (err) {
        if (err !== error) {
          throw err;
        }
      }

      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        CompressionMeasurement.operation,
        TransactionStatus.UNKNOWN_ERROR,
      );
      unmount();
    });

    it('should set the CompressionSizeRatio measurement', () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      result.current(mockImageData, monitoringMock);

      const canvasHandleMock = (getCanvasHandle as jest.Mock).mock.results[0].value;
      const atobMock = jest.spyOn(global.window, 'atob');
      expect(atobMock).toHaveBeenCalledWith(canvasHandleMock.canvas.toDataURL().split(',')[1]);
      expect(monitoringMock.transaction?.setMeasurement).toHaveBeenCalledWith(
        CompressionSizeRatioMeasurement.name,
        atobMock.mock.results[0].value.length / mockImageData.data.length,
        'ratio',
      );
      unmount();
    });

    it('should set the PictureSize measurement', () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      result.current(mockImageData, monitoringMock);

      const canvasHandleMock = (getCanvasHandle as jest.Mock).mock.results[0].value;
      const atobMock = jest.spyOn(global.window, 'atob');
      expect(atobMock).toHaveBeenCalledWith(canvasHandleMock.canvas.toDataURL().split(',')[1]);
      expect(monitoringMock.transaction?.setMeasurement).toHaveBeenCalledWith(
        PictureSizeMeasurement.name,
        atobMock.mock.results[0].value.length,
        'byte',
      );
      unmount();
    });
  });
});
