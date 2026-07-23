import {
  CameraConfig,
  CameraRatio,
  CameraResolution,
  PhotoCaptureAppConfig,
  CompressionFormat,
} from '@monkvision/types';
import { useCallback, useMemo, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { UploadEventHandlers, UploadSuccessPayload } from './useUploadQueue';

/**
 * Resolved camera config where all fields are defined (ratio may still be undefined as it is optional by design).
 */
export type ResolvedCameraConfig = Required<Omit<CameraConfig, 'ratio'>> & {
  ratio?: CameraRatio;
};

const DEFAULT_CAMERA_CONFIG: ResolvedCameraConfig = {
  quality: 0.6,
  format: CompressionFormat.JPEG,
  resolution: CameraResolution.UHD_4K,
  allowImageUpscaling: false,
  ratio: undefined,
};

/**
 * Props passed to the useAdaptiveCameraConfig hook.
 */
export type UseAdaptiveCameraConfigOptions = Pick<
  PhotoCaptureAppConfig,
  'useAdaptiveImageQuality'
> & {
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
  adaptiveCameraConfig: ResolvedCameraConfig;
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

  const onUploadSuccess = useCallback(({ durationMs }: UploadSuccessPayload) => {
    if (durationMs && durationMs > MAX_UPLOAD_DURATION_MS) {
      lowerMaxImageQuality();
    }
  }, []);

  const onUploadTimeout = useCallback(() => lowerMaxImageQuality(), []);

  const config: ResolvedCameraConfig = {
    quality: initialCameraConfig.quality ?? DEFAULT_CAMERA_CONFIG.quality,
    resolution: initialCameraConfig.resolution ?? DEFAULT_CAMERA_CONFIG.resolution,
    format: initialCameraConfig.format ?? DEFAULT_CAMERA_CONFIG.format,
    allowImageUpscaling:
      initialCameraConfig.allowImageUpscaling ?? DEFAULT_CAMERA_CONFIG.allowImageUpscaling,
    ratio: initialCameraConfig.ratio,
  };

  const adaptiveCameraConfig: ResolvedCameraConfig = useMemo(() => {
    const adaptiveConfig: ResolvedCameraConfig = {
      quality: Math.min(maxQuality, config.quality),
      resolution: getLowestResolutionBetween(maxResolution, config.resolution),
      format: initialCameraConfig.format ?? config.format,
      allowImageUpscaling: isImageUpscalingAllowed && config.allowImageUpscaling,
      ratio: initialCameraConfig.ratio,
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
