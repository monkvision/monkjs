import { TransactionStatus } from '@monkvision/monitoring';
import { CompressionOptions, MonkPicture } from '@monkvision/types';
import { RefObject, useCallback } from 'react';
import {
  CompressionMeasurement,
  CompressionSizeRatioMeasurement,
  InternalCameraMonitoringConfig,
  PictureSizeMeasurement,
} from '../monitoring';
import { getCanvasHandle } from './utils';

/**
 * Params given to the useCompression hooks.
 */
export interface UseCompressionParams {
  /**
   * The ref to the canvas element used to draw and compress the image.
   */
  canvasRef: RefObject<HTMLCanvasElement>;
  /**
   * The compression options.
   */
  options: CompressionOptions;
}

/**
 * Function used to compress images and create DataURI objects.
 */
export type CompressFunction = (
  image: ImageData,
  monitoring: InternalCameraMonitoringConfig,
) => Promise<MonkPicture>;

function startCompressionMeasurement(
  monitoring: InternalCameraMonitoringConfig,
  options: CompressionOptions,
  image: ImageData,
): void {
  monitoring.transaction?.startMeasurement(CompressionMeasurement.operation, {
    data: monitoring.data,
    tags: {
      [CompressionMeasurement.formatTagName]: options.format,
      [CompressionMeasurement.qualityTagName]: options.quality,
      [CompressionMeasurement.dimensionsTagName]: `${image.width}x${image.height}`,
      ...(monitoring.tags ?? {}),
    },
    description: CompressionMeasurement.description,
  });
}

function stopCompressionMeasurement(
  monitoring: InternalCameraMonitoringConfig,
  status: TransactionStatus,
): void {
  monitoring.transaction?.stopMeasurement(CompressionMeasurement.operation, status);
}

function setCustomMeasurements(
  monitoring: InternalCameraMonitoringConfig,
  image: ImageData,
  picture: MonkPicture,
): void {
  const imageSizeBytes = image.data.length;
  const pictureSizeBytes = picture.blob.size;
  monitoring.transaction?.setMeasurement(
    CompressionSizeRatioMeasurement.name,
    pictureSizeBytes / imageSizeBytes,
    'ratio',
  );
  monitoring.transaction?.setMeasurement(PictureSizeMeasurement.name, pictureSizeBytes, 'byte');
}

function compressUsingBrowser(
  image: ImageData,
  canvasRef: RefObject<HTMLCanvasElement>,
  options: CompressionOptions,
): Promise<MonkPicture> {
  const { canvas, context } = getCanvasHandle(canvasRef);
  context.putImageData(image, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Unable to convert canvas to Blob, toBlob() returned null.'));
        } else {
          resolve({
            blob,
            uri: URL.createObjectURL(blob),
            mimetype: options.format,
            width: image.width,
            height: image.height,
          });
        }
      },
      options.format,
      options.quality,
    );
  });
}

/**
 * Custom hook used to manage the camera <canvas> element used to take video screenshots and encode images.
 */
export function useCompression({ canvasRef, options }: UseCompressionParams): CompressFunction {
  return useCallback(
    async (image: ImageData, monitoring: InternalCameraMonitoringConfig) => {
      startCompressionMeasurement(monitoring, options, image);
      try {
        const picture = await compressUsingBrowser(image, canvasRef, options);
        setCustomMeasurements(monitoring, image, picture);
        stopCompressionMeasurement(monitoring, TransactionStatus.OK);
        return picture;
      } catch (err) {
        stopCompressionMeasurement(monitoring, TransactionStatus.UNKNOWN_ERROR);
        throw err;
      }
    },
    [options.format, options.quality],
  );
}
