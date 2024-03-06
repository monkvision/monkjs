import { useMonitoring } from '@monkvision/monitoring';
import { useState } from 'react';
import {
  CameraMonitoringConfig,
  InternalCameraMonitoringConfig,
  TakePictureTransaction,
} from '../monitoring';
import { MonkPicture } from './useCompression';

/**
 * Type definition for the parameters of the useTakePicture hook.
 */
export interface UseTakePictureParams {
  /**
   * Callback used to compress the screenshot taken by the takeScreenshot function.
   */
  compress: (image: ImageData, monitoring: InternalCameraMonitoringConfig) => MonkPicture;
  /**
   * Callback used to take the screenshot of the camera video stream.
   */
  takeScreenshot: (monitoring: InternalCameraMonitoringConfig) => ImageData;
  /**
   * Event handler called when a picture has been taken.
   */
  onPictureTaken?: (picture: MonkPicture) => void;
  /**
   * The optional custom monitoring configuration that can be passed to the Camera component.
   */
  monitoring?: CameraMonitoringConfig;
}

/**
 * Custom hook used by the Camera component to create the take picture function.
 */
export function useTakePicture({
  compress,
  takeScreenshot,
  onPictureTaken,
  monitoring,
}: UseTakePictureParams) {
  const { createTransaction } = useMonitoring();
  const [isLoading, setIsLoading] = useState(false);

  const takePicture = () => {
    setIsLoading(true);
    const transaction = createTransaction({ ...TakePictureTransaction, ...monitoring });
    const childMonitoring: InternalCameraMonitoringConfig = {
      transaction,
      data: monitoring?.data,
      tags: monitoring?.tags,
    };
    const screenshot = takeScreenshot(childMonitoring);
    const picture = compress(screenshot, childMonitoring);
    transaction.finish();
    setIsLoading(false);
    if (onPictureTaken) {
      onPictureTaken(picture);
    }
    return picture;
  };

  return { takePicture, isLoading };
}
