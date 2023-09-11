import { useMonitoring } from '@monkvision/monitoring';
import { useCallback } from 'react';
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
  return useCallback(() => {
    const transaction = createTransaction({ ...TakePictureTransaction, ...monitoring });
    const childMonitoring: InternalCameraMonitoringConfig = {
      transaction,
      data: monitoring?.data,
      tags: monitoring?.tags,
    };
    const screenshot = takeScreenshot(childMonitoring);
    const picture = compress(screenshot, childMonitoring);
    transaction.finish();
    return picture;
  }, [takeScreenshot, compress, monitoring]);
}
