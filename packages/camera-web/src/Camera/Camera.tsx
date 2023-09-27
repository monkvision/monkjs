import React, { useMemo } from 'react';
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

/**
 * Component used in MonkJs project used to :
 * - Display a camera preview on the screen
 * - Display a given camera HUD (buttons) on top of the camera preview
 * - Provide tools to control the camera (take picture, compress images etc...)
 *
 * Please refer to the official documentation of the @monkvision/camera-web package (available
 * [here](https://github.com/monkvision/monkjs/blob/main/packages/camera-web/README.md)) for more details on how this
 * component works.
 */
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
  const { takePicture, isLoading: isTakePictureLoading } = useTakePicture({
    compress,
    takeScreenshot,
    onPictureTaken,
    monitoring,
  });
  const isLoading = useMemo(
    () => isPreviewLoading || isTakePictureLoading,
    [isPreviewLoading, isTakePictureLoading],
  );
  const HUDElement = useCameraHUD({
    component: HUDComponent,
    handle: { takePicture, error, retry, isLoading },
  });

  return (
    <div className='mnk-camera-container'>
      <video
        data-testid='camera-video-preview'
        ref={videoRef}
        className='mnk-camera-preview'
        autoPlay
        playsInline
        controls={false}
      />
      <canvas data-testid='camera-canvas' ref={canvasRef} className='mnk-camera-canvas' />
      <div className='hud-container'>{HUDElement}</div>
    </div>
  );
}
