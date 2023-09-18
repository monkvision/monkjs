import { TransactionStatus } from '@monkvision/monitoring';
import { RefObject, useCallback } from 'react';
import {
  CompressionMeasurement,
  CompressionSizeRatioMeasurement,
  InternalCameraMonitoringConfig,
  PictureSizeMeasurement,
} from '../monitoring';
import { getCanvasHandle } from './getCanvasHandle';

/**
 * Enumeration of the different compression format available for the Monk Camera
 */
export enum CompressionFormat {
  /**
   * Compression using the JPEG format.
   */
  JPEG = 'image/jpeg',
}

/**
 * Options used to specify the type of compression and encoding applied to the pictures taken by the Camera.
 */
export interface CompressionOptions {
  /**
   * The output format of the compression.
   *
   * @default CompressionFormat.JPEG
   */
  format: CompressionFormat;
  /**
   * Value indicating image quality for the compression output. This value goes from 1 (full quality, no loss) to 0
   * (very low quality). For compression formats that do not supported lossy compression, this option is ignored.
   *
   * @default 0.8
   */
  quality: number;
}

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
 * Interface describing the details of a picture taken and compressed by the Monk camera.
 */
export interface MonkPicture {
  /**
   * The DataURI of the picture.
   */
  uri: string;
  /**
   * The mimetype (format) of the picture.
   */
  mimetype: string;
  /**
   * The width (in pixels) of the picture.
   */
  width: number;
  /**
   * The height (in pixels) of the picture.
   */
  height: number;
}

/**
 * Handle used to compress images.
 */
export interface CompressionHandle {
  /**
   * Function used to compress images and create DataURI objects.
   */
  compress: (image: ImageData, monitoring: InternalCameraMonitoringConfig) => MonkPicture;
}

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
  const pictureSizeBytes = window.atob(picture.uri.split(',')[1]).length;
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
): MonkPicture {
  const { canvas, context } = getCanvasHandle(canvasRef);
  context.putImageData(image, 0, 0);
  return {
    uri: canvas.toDataURL(options.format, options.quality),
    mimetype: options.format,
    width: image.width,
    height: image.height,
  };
}

/**
 * Custom hook used to manage the camera <canvas> element used to take video screenshots and encode images.
 */
export function useCompression({ canvasRef, options }: UseCompressionParams): CompressionHandle {
  const compress = useCallback(
    (image: ImageData, monitoring: InternalCameraMonitoringConfig) => {
      startCompressionMeasurement(monitoring, options, image);
      try {
        const picture = compressUsingBrowser(image, canvasRef, options);
        setCustomMeasurements(monitoring, image, picture);
        stopCompressionMeasurement(monitoring, TransactionStatus.OK);
        return picture;
      } catch (err) {
        stopCompressionMeasurement(monitoring, TransactionStatus.UNKNOWN_ERROR);
        throw err;
      }
    },
    [options],
  );
  return { compress };
}
