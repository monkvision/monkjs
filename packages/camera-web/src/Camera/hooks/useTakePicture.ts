import { useMonitoring } from '@monkvision/monitoring';
import { useCallback, useState } from 'react';
import {
  CameraMonitoringConfig,
  InternalCameraMonitoringConfig,
  TakePictureTransaction,
} from '../monitoring';
import { MonkPicture } from './useCompression';

export interface UseTakePictureParams {
  compress: (image: ImageData, monitoring: InternalCameraMonitoringConfig) => MonkPicture;
  takeScreenshot(monitoring: InternalCameraMonitoringConfig): ImageData;
  monitoring?: CameraMonitoringConfig;
}

export function useTakePicture({ compress, takeScreenshot, monitoring }: UseTakePictureParams) {
  const { createTransaction } = useMonitoring();
  const [isLoading, setIsLoading] = useState(false);
  const takePicture = useCallback(() => {
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
    return picture;
  }, [takeScreenshot, compress, monitoring]);

  return {
    takePicture,
    isLoading,
  };
}
