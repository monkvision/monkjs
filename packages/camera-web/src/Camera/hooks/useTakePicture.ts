import { useMonitoring } from '@monkvision/monitoring';
import { useObjectMemo } from '@monkvision/common';
import { MonkPicture } from '@monkvision/types';
import { RefObject, useCallback, useState } from 'react';
import {
  CameraMonitoringConfig,
  InternalCameraMonitoringConfig,
  TakePictureTransaction,
} from '../monitoring';
import { CompressFunction } from './useCompression';
import { UserMediaResult } from './useUserMedia';
import { useBlurDetection } from './useBlurDetection';

/**
 * Type definition for the parameters of the useTakePicture hook.
 */
export interface UseTakePictureParams
  extends Pick<UserMediaResult, 'availableCameraDevices' | 'selectedCameraDeviceId'> {
  /**
   * Callback used to compress the screenshot taken by the takeScreenshot function.
   */
  compress: CompressFunction;
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
  /**
   * Ref to the video element used for blur detection before capture.
   * If not provided, blur detection is skipped.
   */
  videoRef?: RefObject<HTMLVideoElement | null>;
  /**
   * Laplacian variance threshold for blur detection. Frames below this score are
   * considered blurry and the capture is silently blocked (onPictureTaken is not called).
   * Set to 0 to disable. Default: 80.
   */
  blurThreshold?: number;
}

function createTakePictureTransactionData({
  monitoring,
  availableCameraDevices,
  selectedCameraDeviceId,
}: Pick<
  UseTakePictureParams,
  'monitoring' | 'availableCameraDevices' | 'selectedCameraDeviceId'
>): Record<string, string | string[] | null> {
  return {
    ...monitoring?.data,
    availableCameras: availableCameraDevices.map(
      (deviceInfo) => `${deviceInfo.label} (${deviceInfo.deviceId})`,
    ),
    selectedCameraId: selectedCameraDeviceId,
  };
}

/**
 * Custom hook used by the Camera component to create the take picture function.
 * Includes an optional blur gate: if `videoRef` and `blurThreshold > 0` are provided,
 * the shutter is silently blocked when the current frame is too blurry.
 * The `isBlurry` flag can be used by the HUD to show a 'Hold still' indicator.
 */
export function useTakePicture({
  compress,
  takeScreenshot,
  onPictureTaken,
  monitoring,
  availableCameraDevices,
  selectedCameraDeviceId,
  videoRef,
  blurThreshold = 80,
}: UseTakePictureParams) {
  const { createTransaction } = useMonitoring();
  const [isLoading, setIsLoading] = useState(false);
  const { isBlurry, checkFrame } = useBlurDetection({ threshold: blurThreshold });

  const takePicture = useCallback(async () => {
    // Blur gate: if the current frame is too blurry, block capture silently.
    // isBlurry is updated so the HUD can show a 'Hold still' indicator.
    if (videoRef?.current && blurThreshold > 0) {
      const isSharp = checkFrame(videoRef.current);
      if (!isSharp) {
        // Return a rejected-ish promise that resolves to undefined — callers discard the value.
        // We cast to satisfy the original return type while not calling onPictureTaken.
        return undefined as unknown as MonkPicture;
      }
    }

    setIsLoading(true);
    const data = createTakePictureTransactionData({
      monitoring,
      availableCameraDevices,
      selectedCameraDeviceId,
    });
    const transaction = createTransaction({ ...TakePictureTransaction, ...monitoring, data });
    const childMonitoring: InternalCameraMonitoringConfig = {
      transaction,
      data: monitoring?.data,
      tags: monitoring?.tags,
    };
    const screenshot = takeScreenshot(childMonitoring);
    const picture = await compress(screenshot, childMonitoring);
    transaction.finish();
    setIsLoading(false);
    if (onPictureTaken) {
      onPictureTaken(picture);
    }
    return picture;
  }, [createTransaction, monitoring, takeScreenshot, compress, onPictureTaken, videoRef, blurThreshold, checkFrame, availableCameraDevices, selectedCameraDeviceId]);

  return useObjectMemo({ takePicture, isLoading, isBlurry });
}
