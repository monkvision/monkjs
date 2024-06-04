const blobMock = { size: 42 };
jest.mock('../../../src/Camera/hooks/utils/getCanvasHandle', () => ({
  getCanvasHandle: jest.fn(() => ({
    canvas: {
      toBlob: jest.fn((callback) => callback(blobMock)),
    },
    context: { putImageData: jest.fn() },
  })),
}));

const testUrl = 'test-url-test-test';
global.URL.createObjectURL = jest.fn(() => testUrl);

import { TransactionStatus } from '@monkvision/monitoring';
import { renderHook } from '@testing-library/react-hooks';
import { RefObject } from 'react';
import { CompressionFormat } from '@monkvision/types';
import { getCanvasHandle } from '../../../src/Camera/hooks/utils';
import { useCompression } from '../../../src/Camera/hooks';
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
    it('should compress images in JPEG', async () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.6 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      const picture = await result.current(mockImageData, monitoringMock);

      const canvasHandleMock = (getCanvasHandle as jest.Mock).mock.results[0].value;
      expect(getCanvasHandle).toHaveBeenCalledWith(canvasRef);
      expect(canvasHandleMock.context.putImageData).toHaveBeenCalledWith(mockImageData, 0, 0);
      expect(canvasHandleMock.canvas.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        options.format,
        options.quality,
      );
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(blobMock);
      expect(picture).toEqual({
        blob: blobMock,
        uri: testUrl,
        mimetype: options.format,
        width: mockImageData.width,
        height: mockImageData.height,
      });
      unmount();
    });

    it('should throw an error if the getCanvasHandle function fails', async () => {
      const error = new Error('test');
      (getCanvasHandle as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.6 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      await expect(result.current(mockImageData, monitoringMock)).rejects.toEqual(error);
      unmount();
    });

    it('should start the Compression measurement with the proper config', () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.6 };

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

    it('should stop the Compression measurement with the OK status', async () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.6 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      await result.current(mockImageData, monitoringMock);

      expect(monitoringMock.transaction?.stopMeasurement).toHaveBeenCalledWith(
        CompressionMeasurement.operation,
        TransactionStatus.OK,
      );
      unmount();
    });

    it('should stop the Compression measurement with the ERROR status if the getCanvasHandle fails', async () => {
      const error = new Error('test');
      (getCanvasHandle as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.6 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      try {
        await result.current(mockImageData, monitoringMock);
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

    it('should set the CompressionSizeRatio measurement', async () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.6 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      await result.current(mockImageData, monitoringMock);

      expect(monitoringMock.transaction?.setMeasurement).toHaveBeenCalledWith(
        CompressionSizeRatioMeasurement.name,
        blobMock.size / mockImageData.data.length,
        'ratio',
      );
      unmount();
    });

    it('should set the PictureSize measurement', async () => {
      const canvasRef = {} as RefObject<HTMLCanvasElement>;
      const options = { format: CompressionFormat.JPEG, quality: 0.6 };

      const { result, unmount } = renderHook(useCompression, {
        initialProps: { canvasRef, options },
      });

      await result.current(mockImageData, monitoringMock);

      expect(monitoringMock.transaction?.setMeasurement).toHaveBeenCalledWith(
        PictureSizeMeasurement.name,
        blobMock.size,
        'byte',
      );
      unmount();
    });
  });
});
