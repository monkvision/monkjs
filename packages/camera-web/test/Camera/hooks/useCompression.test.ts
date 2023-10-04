const dataURLMock = 'picture,test-url';
const contextMock = { putImageData: jest.fn() };
const canvasMock = { toDataURL: jest.fn(() => dataURLMock) };
const getCanvasHandleMock = jest.fn(() => ({
  canvas: canvasMock,
  context: contextMock,
})) as jest.Mock;
jest.mock('../../../src/Camera/hooks/getCanvasHandle', () => ({
  getCanvasHandle: getCanvasHandleMock,
}));

const atobMockResult = 'test-url-test-test';
const atobMock = jest.fn(() => atobMockResult);
Object.defineProperty(global.window, 'atob', {
  value: atobMock,
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

      const picture = result.current.compress(mockImageData, monitoringMock);

      expect(getCanvasHandleMock).toHaveBeenCalledWith(canvasRef);
      expect(contextMock.putImageData).toHaveBeenCalledWith(mockImageData, 0, 0);
      expect(canvasMock.toDataURL).toHaveBeenCalledWith(options.format, options.quality);
      expect(picture).toEqual({
        uri: dataURLMock,
        mimetype: options.format,
        width: mockImageData.width,
        height: mockImageData.height,
      });
      unmount();
    });

    it('should throw an error if the getCanvasHandle function fails', () => {
      const error = new Error('test');
      getCanvasHandleMock.mockImplementationOnce(() => {
        throw error;
      });
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      expect(() => result.current.compress(mockImageData, monitoringMock)).toThrow(error);
      unmount();
    });

    it('should start the Compression measurement with the proper config', () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      result.current.compress(mockImageData, monitoringMock);

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

      result.current.compress(mockImageData, monitoringMock);

      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        CompressionMeasurement.operation,
        TransactionStatus.OK,
      );
      unmount();
    });

    it('should stop the Compression measurement with the ERROR status if the getCanvasHandle fails', () => {
      const error = new Error('test');
      getCanvasHandleMock.mockImplementationOnce(() => {
        throw error;
      });
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.8 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      try {
        result.current.compress(mockImageData, monitoringMock);
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

      result.current.compress(mockImageData, monitoringMock);

      expect(atobMock).toHaveBeenCalledWith(dataURLMock.split(',')[1]);
      expect(monitoringMock.transaction?.setMeasurement).toHaveBeenCalledWith(
        CompressionSizeRatioMeasurement.name,
        atobMockResult.length / mockImageData.data.length,
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

      result.current.compress(mockImageData, monitoringMock);

      expect(atobMock).toHaveBeenCalledWith(dataURLMock.split(',')[1]);
      expect(monitoringMock.transaction?.setMeasurement).toHaveBeenCalledWith(
        PictureSizeMeasurement.name,
        atobMockResult.length,
        'byte',
      );
      unmount();
    });
  });
});
