import { useState } from 'react';
import { CameraFacingMode, CameraResolution, CompressionFormat } from '@monkvision/camera-web';

export function useCameraConfig() {
  const [cameraState] = useState({
    facingMode: CameraFacingMode.ENVIRONMENT,
    resolution: CameraResolution.UHD_4K,
    compressionFormat: CompressionFormat.JPEG,
    quality: '0.8',
  });

  const CAMERA_RESOLUTION_SIZES: {
    [key in CameraResolution]: { width: number; height: number };
  } = {
    [CameraResolution.QNHD_180P]: { width: 320, height: 180 },
    [CameraResolution.NHD_360P]: { width: 640, height: 360 },
    [CameraResolution.HD_720P]: { width: 1280, height: 720 },
    [CameraResolution.FHD_1080P]: { width: 1920, height: 1080 },
    [CameraResolution.QHD_2K]: { width: 2560, height: 1440 },
    [CameraResolution.UHD_4K]: { width: 3840, height: 2160 },
  };

  function getCameraDimensions() {
    return CAMERA_RESOLUTION_SIZES[cameraState.resolution];
  }
  return { cameraState, getCameraDimensions };
}
