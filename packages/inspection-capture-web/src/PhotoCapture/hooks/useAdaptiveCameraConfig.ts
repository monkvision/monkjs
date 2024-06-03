import {
  CameraConfig,
  CameraResolution,
  CaptureAppConfig,
  CompressionFormat,
} from '@monkvision/types';
import { useCallback, useMemo, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { UploadEventHandlers } from './useUploadQueue';

const DEFAULT_CAMERA_CONFIG: Required<CameraConfig> = {
  quality: 0.8,
  format: CompressionFormat.JPEG,
  resolution: CameraResolution.UHD_4K,
  allowImageUpscaling: false,
};

/**
 * Props passed to the useAdaptiveCameraConfig hook.
 */
export type UseAdaptiveCameraConfigOptions = Pick<CaptureAppConfig, 'useAdaptiveImageQuality'> & {
  /**
   * The camera config passed as a prop to the PhotoCapture component.
   */
  initialCameraConfig: CameraConfig;
};

/**
 * Handle used to manage the adaptive camera configuration.
 */
export interface AdaptiveCameraConfigHandle {
  /**
   * The resulting camera configuration, that adapts itself automatically if asked.
   */
  adaptiveCameraConfig: Required<CameraConfig>;
  /**
   * A set of event handlers listening to upload events.
   */
  uploadEventHandlers: UploadEventHandlers;
}

const CAMERA_RESOLUTION_COMPARISON_MAP: Record<CameraResolution, number> = {
  [CameraResolution.UHD_4K]: 4000,
  [CameraResolution.QHD_2K]: 2000,
  [CameraResolution.FHD_1080P]: 1000,
  [CameraResolution.HD_720P]: 720,
  [CameraResolution.NHD_360P]: 360,
  [CameraResolution.QNHD_180P]: 180,
};

function getLowestResolutionBetween(a: CameraResolution, b: CameraResolution): CameraResolution {
  return CAMERA_RESOLUTION_COMPARISON_MAP[a] > CAMERA_RESOLUTION_COMPARISON_MAP[b] ? b : a;
}

const MAX_UPLOAD_DURATION_MS = 15000;

/**
 * Custom hook used to adapt the camera configuration of the PhotoCapture component based on various things suchs as
 * connection quality etc.
 */
export function useAdaptiveCameraConfig({
  initialCameraConfig,
  useAdaptiveImageQuality,
}: UseAdaptiveCameraConfigOptions): AdaptiveCameraConfigHandle {
  const [maxQuality, setMaxQuality] = useState(1);
  const [maxResolution, setMaxResolution] = useState(CameraResolution.UHD_4K);
  const [isImageUpscalingAllowed, setIsImageUpscalingAllowed] = useState(true);

  const lowerMaxImageQuality = () => {
    setMaxQuality(0.6);
    setMaxResolution(CameraResolution.QHD_2K);
    setIsImageUpscalingAllowed(false);
  };

  const onUploadSuccess = useCallback((durationMs: number) => {
    if (durationMs > MAX_UPLOAD_DURATION_MS) {
      lowerMaxImageQuality();
    }
  }, []);

  const onUploadTimeout = useCallback(() => lowerMaxImageQuality(), []);

  const config = {
    quality: initialCameraConfig.quality ?? DEFAULT_CAMERA_CONFIG.quality,
    resolution: initialCameraConfig.resolution ?? DEFAULT_CAMERA_CONFIG.resolution,
    format: initialCameraConfig.format ?? DEFAULT_CAMERA_CONFIG.format,
    allowImageUpscaling:
      initialCameraConfig.allowImageUpscaling ?? DEFAULT_CAMERA_CONFIG.allowImageUpscaling,
  };

  const adaptiveCameraConfig: Required<CameraConfig> = useMemo(() => {
    const adaptiveConfig = {
      quality: Math.min(maxQuality, config.quality),
      resolution: getLowestResolutionBetween(maxResolution, config.resolution),
      format: initialCameraConfig.format ?? config.format,
      allowImageUpscaling: isImageUpscalingAllowed && config.allowImageUpscaling,
    };
    return useAdaptiveImageQuality ? adaptiveConfig : config;
  }, [
    config.quality,
    config.resolution,
    config.format,
    config.allowImageUpscaling,
    maxQuality,
    maxResolution,
    isImageUpscalingAllowed,
  ]);

  return useObjectMemo({
    adaptiveCameraConfig,
    uploadEventHandlers: {
      onUploadSuccess,
      onUploadTimeout,
    },
  });
}
