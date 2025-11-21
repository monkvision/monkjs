import React, { useCallback, useMemo } from 'react';
import {
  AllOrNone,
  CameraConfig,
  CameraResolution,
  CompressionFormat,
  RequiredKeys,
} from '@monkvision/types';
import { isMobileDevice } from '@monkvision/common';
import {
  CameraFacingMode,
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
 * Type definition for the HUD component and its props passed to the Camera component. Monk uses this custom type in
 * order to enforce typing on the following configurations :
 *
 * - If the HUD component does not have any required props, the Camera component will allow developers to pass it either
 * the HUDComponent or both the component and its props.
 * - If the HUD component does indeed have required props, the Camera component will only accept either BOTH the
 * HUDComponent and its props, or none of them.
 *
 * This is done in order to ensure that developers do not pass HUD components that need specific props to be rendered to
 * the Camera without actually passing those props as well.
 */
export type HUDConfigProps<T extends object> = RequiredKeys<T> extends never
  ? {
      /**
       * HUD component to display above the camera preview.
       *
       * Note: If this component needs custom props to be rendered, don't forget to pass them to the Camera in the
       * `hudProps` props.
       */
      HUDComponent?: CameraHUDComponent<T>;
      /**
       * Additional props passed to the HUD component when it will be rendered.
       */
      hudProps?: T;
    }
  : AllOrNone<{ HUDComponent: CameraHUDComponent<T>; hudProps: T }>;

/**
 * Props given to the Camera component. The generic T type corresponds to the prop types of the HUD.
 */
export type CameraProps<T extends object> = CameraConfig &
  CameraEventHandlers &
  HUDConfigProps<T> & {
    /**
     * Additional monitoring config that can be provided to the Camera component.
     */
    monitoring?: CameraMonitoringConfig;
  };

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
export function Camera<T extends object>({
  resolution = CameraResolution.UHD_4K,
  format = CompressionFormat.JPEG,
  quality = 0.6,
  allowImageUpscaling = false,
  HUDComponent,
  hudProps,
  monitoring,
  onPictureTaken,
}: CameraProps<T>) {
  const previewResolution = useMemo(
    () => (isMobileDevice() ? CameraResolution.UHD_4K : CameraResolution.FHD_1080P),
    [],
  );
  const {
    ref: videoRef,
    previewDimensions,
    error,
    retry,
    isLoading: isPreviewLoading,
    availableCameraDevices,
    selectedCameraDeviceId,
  } = useCameraPreview({
    resolution: previewResolution,
    facingMode: CameraFacingMode.ENVIRONMENT,
  });
  const { ref: canvasRef, dimensions: canvasDimensions } = useCameraCanvas({
    resolution,
    streamDimensions: previewDimensions,
    allowImageUpscaling,
  });
  const takeScreenshot = useCameraScreenshot({
    videoRef,
    canvasRef,
    dimensions: canvasDimensions,
  });
  const compress = useCompression({ canvasRef, options: { format, quality } });
  const { takePicture, isLoading: isTakePictureLoading } = useTakePicture({
    compress,
    takeScreenshot,
    onPictureTaken,
    monitoring,
    availableCameraDevices,
    selectedCameraDeviceId,
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
          muted={true}
          data-testid='camera-video-preview'
        />
        <canvas ref={canvasRef} style={styles['cameraCanvas']} data-testid='camera-canvas' />
      </div>
    ),
    [],
  );

  const getImageData = useCallback(() => takeScreenshot(), [takeScreenshot]);
  const compressImage = useCallback((image: ImageData) => compress(image), [compress]);

  return HUDComponent ? (
    <HUDComponent
      handle={{
        takePicture,
        getImageData,
        compressImage,
        error,
        retry,
        isLoading,
        dimensions: previewDimensions,
        previewDimensions,
      }}
      cameraPreview={cameraPreview}
      {...((hudProps ?? {}) as T)}
    />
  ) : (
    <>{cameraPreview}</>
  );
}
