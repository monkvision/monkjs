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
  videoRef: RefObject<HTMLVideoElement>;
  /**
   * The ref to the canvas element used to draw the screenshots
   */
  canvasRef: RefObject<HTMLCanvasElement>;
  /**
   * The dimensions of the screenshot.
   */
  dimensions: PixelDimensions | null;
}

/**
 * Interface describing a handle that can be used to take a screenshot of a video element.
 */
export interface CameraScreenshotHandle {
  /**
   * Callback used to take a screenshot.
   *
   * @return A ImageData object that contains the raw pixel's data.
   */
  takeScreenshot: (monitoring: InternalCameraMonitoringConfig) => ImageData;
}

function startScreenshotMeasurement(
  monitoring: InternalCameraMonitoringConfig,
  dimensions: PixelDimensions | null,
): void {
  monitoring.transaction?.startMeasurement(ScreenshotMeasurement.operation, {
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
  monitoringConfig: InternalCameraMonitoringConfig,
  status: TransactionStatus,
): void {
  monitoringConfig.transaction?.stopMeasurement(ScreenshotMeasurement.operation, status);
}

function setScreeshotSizeMeasurement(
  monitoring: InternalCameraMonitoringConfig,
  image: ImageData,
): void {
  const imageSizeBytes = image.data.length;
  monitoring.transaction?.setMeasurement(ScreenshotSizeMeasurement.name, imageSizeBytes, 'byte');
}

/**
 * Custom hook used to take screenshots of a video element. This hook is aimed to be used in pair with a `<canvas>`
 * element referenced by the returned ref.
 */
export function useCameraScreenshot({
  videoRef,
  canvasRef,
  dimensions,
}: CameraScreenshotConfig): CameraScreenshotHandle {
  const takeScreenshot = useCallback(
    (monitoring: InternalCameraMonitoringConfig) => {
      startScreenshotMeasurement(monitoring, dimensions);
      const { context } = getCanvasHandle(canvasRef, () =>
        stopScreenshotMeasurement(monitoring, TransactionStatus.UNKNOWN_ERROR),
      );
      if (!dimensions) {
        stopScreenshotMeasurement(monitoring, TransactionStatus.UNKNOWN_ERROR);
        throw new Error('Unable to take a picture because the video stream has no dimension.');
      }
      if (!videoRef.current) {
        stopScreenshotMeasurement(monitoring, TransactionStatus.UNKNOWN_ERROR);
        throw new Error('Unable to take a picture because the video element is null.');
      }
      context.drawImage(videoRef.current, 0, 0, dimensions.width, dimensions.height);
      const imageData = context.getImageData(0, 0, dimensions.width, dimensions.height);
      setScreeshotSizeMeasurement(monitoring, imageData);
      stopScreenshotMeasurement(monitoring, TransactionStatus.OK);
      return imageData;
    },
    [dimensions],
  );

  return { takeScreenshot };
}
