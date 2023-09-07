import React, { useCallback, useEffect, useMemo } from 'react';
import './Camera.css';
import {
  CameraConfig,
  CameraEventHandlers,
  CameraFacingMode,
  CameraHUDComponent,
  CameraResolution,
  CompressionFormat,
  CompressionOptions,
  useCameraCanvas,
  useCameraHUD,
  useCameraPreview,
  useCameraScreenshot,
  useCompression,
} from './hooks';

/**
 * Props given to the Camera component.
 */
export interface CameraProps
  extends Partial<CameraConfig>,
    Partial<CompressionOptions>,
    CameraEventHandlers {
  /**
   * Optional HUD component to display above the camera preview.
   */
  HUDComponent?: CameraHUDComponent;
}

export function Camera({
  facingMode = CameraFacingMode.ENVIRONMENT,
  resolution = CameraResolution.UHD_4K,
  deviceId,
  format = CompressionFormat.JPEG,
  quality = 0.8,
  HUDComponent,
  onPictureTaken,
}: CameraProps) {
  const cameraConfig = useMemo(
    () => ({ facingMode, resolution, deviceId }),
    [facingMode, resolution, deviceId],
  );
  const compressionOptions = useMemo(() => ({ format, quality }), [format, quality]);
  const {
    ref: videoRef,
    dimensions,
    error,
    retry,
    isLoading: isPreviewLoading,
  } = useCameraPreview(cameraConfig);
  const { ref: canvasRef } = useCameraCanvas({ dimensions });
  const { takeScreenshot } = useCameraScreenshot({ videoRef, canvasRef, dimensions });
  const { compress } = useCompression({ canvasRef, options: compressionOptions });
  const isLoading = useMemo(() => isPreviewLoading, [isPreviewLoading]);
  const takePicture = useCallback(() => compress(takeScreenshot()), [takeScreenshot, compress]);
  const cameraHUDParams = useMemo(
    () => ({
      component: HUDComponent,
      handle: { takePicture, error, retry, isLoading },
      eventHandlers: { onPictureTaken },
    }),
    [HUDComponent, takePicture, error, retry, isLoading, onPictureTaken],
  );
  const HUDElement = useCameraHUD(cameraHUDParams);

  return (
    <div className='camera-container'>
      <video ref={videoRef} className='camera-preview' autoPlay playsInline controls={false} />
      <canvas ref={canvasRef} className='camera-canvas' />
      <div className='hud-container'>{HUDElement}</div>
    </div>
  );
}
