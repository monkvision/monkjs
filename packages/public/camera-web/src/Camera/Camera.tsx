import React, { useMemo } from 'react';
import {
  CameraConfig,
  CameraFacingMode,
  CameraResolution,
  CompressionFormat,
  CompressionOptions,
  useCameraCanvas,
  useCameraPreview,
  useCameraScreenshot,
  useCompression,
  useTakePicture,
} from './hooks';
import { CameraMonitoringConfig } from './monitoring';
import { styles } from './Camera.styles';
import { CameraEventHandlers, CameraHUDComponent } from './CameraHUD.types';

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
  const {
    ref: videoRef,
    dimensions,
    error,
    retry,
    isLoading: isPreviewLoading,
  } = useCameraPreview({ facingMode, resolution, deviceId });
  const { ref: canvasRef } = useCameraCanvas({ dimensions });
  const { takeScreenshot } = useCameraScreenshot({ videoRef, canvasRef, dimensions });
  const { compress } = useCompression({ canvasRef, options: { format, quality } });
  const { takePicture, isLoading: isTakePictureLoading } = useTakePicture({
    compress,
    takeScreenshot,
    onPictureTaken,
    monitoring,
  });
  const isLoading = isPreviewLoading || isTakePictureLoading;
  const cameraPreview = useMemo(
    () => (
      <div style={styles['container']}>
        <video
          style={styles['cameraPreview']}
          ref={videoRef}
          autoPlay
          playsInline={true}
          controls={false}
          data-testid='camera-video-preview'
        />
        <canvas ref={canvasRef} style={styles['cameraCanvas']} data-testid='camera-canvas' />
      </div>
    ),
    [],
  );

  return HUDComponent ? (
    <HUDComponent
      handle={{ takePicture, error, retry, isLoading, dimensions }}
      cameraPreview={cameraPreview}
    />
  ) : (
    <>{cameraPreview}</>
  );
}
