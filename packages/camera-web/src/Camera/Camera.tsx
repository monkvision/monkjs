import { Transaction } from '@monkvision/monitoring';
import React, { useMemo, useState } from 'react';
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
  useTakePicture,
} from './hooks';
import { CameraMonitoringConfig } from './monitoring';

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
  /**
   * Additional monitoring config that can be provided to the Camera component.
   */
  monitoring?: CameraMonitoringConfig;
}

export function Camera({
  facingMode = CameraFacingMode.ENVIRONMENT,
  resolution = CameraResolution.UHD_4K,
  deviceId,
  format = CompressionFormat.JPEG,
  quality = 0.8,
  HUDComponent,
  monitoring,
  onPictureTaken,
}: CameraProps) {
  const compressionOptions = useMemo(() => ({ format, quality }), [format, quality]);
  const {
    ref: videoRef,
    dimensions,
    error,
    retry,
    isLoading: isPreviewLoading,
  } = useCameraPreview({ facingMode, resolution, deviceId });
  const { ref: canvasRef } = useCameraCanvas({ dimensions });
  const { takeScreenshot } = useCameraScreenshot({ videoRef, canvasRef, dimensions });
  const { compress } = useCompression({ canvasRef, options: compressionOptions });
  const isLoading = useMemo(() => isPreviewLoading, [isPreviewLoading]);
  const takePicture = useTakePicture({ compress, takeScreenshot, monitoring });
  const HUDElement = useCameraHUD({
    component: HUDComponent,
    handle: { takePicture, error, retry, isLoading },
    eventHandlers: { onPictureTaken },
  });

  return (
    <div className='camera-container'>
      <video ref={videoRef} className='camera-preview' autoPlay playsInline controls={false} />
      <canvas ref={canvasRef} className='camera-canvas' />
      <div className='hud-container'>{HUDElement}</div>
    </div>
  );
}
