import { RefObject, useCallback } from 'react';
import { TransactionStatus } from '@monkvision/monitoring';
import { PixelDimensions } from '@monkvision/types';
import {
  InternalCameraMonitoringConfig,
  ScreenshotMeasurement,
  ScreenshotSizeMeasurement,
} from '../monitoring';
import { getCanvasHandle } from './utils';

/**
 * Configuration parameters for the `useCameraScreenshot` hook.
 */
export interface CameraScreenshotConfig {
  /**
   * The ref to the video element to take screenshots of.
   */
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * The ref to the canvas element used to draw the screenshots
   */
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /**
   * The dimensions of the screenshot.
   */
  dimensions: PixelDimensions | null;
}

/**
 * Callback used to take a screenshot.
 *
 * @return A ImageData object that contains the raw pixel's data.
 */
export type TakeScreenshotFunction = (monitoring?: InternalCameraMonitoringConfig) => ImageData;

function startScreenshotMeasurement(
  dimensions: PixelDimensions | null,
  monitoring?: InternalCameraMonitoringConfig | undefined,
): void {
  monitoring?.transaction?.startMeasurement(ScreenshotMeasurement.operation, {
    data: monitoring.data,
    tags: {
      [ScreenshotMeasurement.outputResolutionTagName]: dimensions
        ? `${dimensions.width}x${dimensions.height}`
        : 'null',
      ...(monitoring.tags ?? {}),
    },
    description: ScreenshotMeasurement.description,
  });
}

function stopScreenshotMeasurement(
  status: TransactionStatus,
  monitoring: InternalCameraMonitoringConfig | undefined,
): void {
  monitoring?.transaction?.stopMeasurement(ScreenshotMeasurement.operation, status);
}

function setScreeshotSizeMeasurement(
  image: ImageData,
  monitoring?: InternalCameraMonitoringConfig | undefined,
): void {
  const imageSizeBytes = image.data.length;
  monitoring?.transaction?.setMeasurement(ScreenshotSizeMeasurement.name, imageSizeBytes, 'byte');
}

/**
 * Custom hook used to take screenshots of a video element. This hook is aimed to be used in pair with a `<canvas>`
 * element referenced by the returned ref.
 */
export function useCameraScreenshot({
  videoRef,
  canvasRef,
  dimensions,
}: CameraScreenshotConfig): TakeScreenshotFunction {
  return useCallback(
    (monitoring?: InternalCameraMonitoringConfig) => {
      startScreenshotMeasurement(dimensions, monitoring);
      const { context } = getCanvasHandle(canvasRef, () =>
        stopScreenshotMeasurement(TransactionStatus.UNKNOWN_ERROR, monitoring),
      );
      if (!dimensions) {
        stopScreenshotMeasurement(TransactionStatus.UNKNOWN_ERROR, monitoring);
        throw new Error('Unable to take a picture because the video stream has no dimension.');
      }
      if (!videoRef.current) {
        stopScreenshotMeasurement(TransactionStatus.UNKNOWN_ERROR, monitoring);
        throw new Error('Unable to take a picture because the video element is null.');
      }
      context.drawImage(videoRef.current, 0, 0, dimensions.width, dimensions.height);
      const imageData = context.getImageData(0, 0, dimensions.width, dimensions.height);
      setScreeshotSizeMeasurement(imageData, monitoring);
      stopScreenshotMeasurement(TransactionStatus.OK, monitoring);
      return imageData;
    },
    [dimensions],
  );
}
