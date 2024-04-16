import React, { useMemo, useState } from 'react';
import { AllOrNone, RequiredKeys } from '@monkvision/types';
import {
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
export type CameraProps<T extends object> = Partial<CompressionOptions> &
  CameraEventHandlers &
  HUDConfigProps<T> & {
    /**
     * This option specifies the resolution of the pictures taken by the Camera. This option does not affect the
     * resolution of the Camera preview (it will always be the highest resolution possible). If the specified resolution
     * is not equal to the one used by the device's native camera, the pictures taken will be scaled to fit the
     * requirements. Note that if the aspect ratio of the specified resolution differs from the one of the device's
     * camera, pictures taken will always have the same aspect ratio as the native camera one, and will be scaled in a way
     * to make sure that neither the width, nor the height of the output picture will exceed the dimensions of the
     * specified resolution.
     *
     * Note: If the specified resolution is higher than the best resolution available on the current device, output
     * pictures will only be scaled up to the specified resolution if the `allowImageUpscaling` property is set to `true`.
     *
     * @default CameraResolution.UHD_4K
     */
    resolution?: CameraResolution;
    /**
     * When the native resolution of the device Camera is smaller than the resolution asked in the `resolution` prop,
     * resulting pictures will only be scaled up if this property is set to `true`.
     *
     * @default false
     */
    allowImageUpscaling?: boolean;
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
  quality = 0.8,
  allowImageUpscaling = false,
  HUDComponent,
  hudProps,
  monitoring,
  onPictureTaken,
}: CameraProps<T>) {
  const [count, setCount] = useState(0);
  const {
    ref: videoRef,
    dimensions: streamDimensions,
    error,
    retry,
    isLoading: isPreviewLoading,
    debug,
    log,
  } = useCameraPreview({
    resolution: CameraResolution.UHD_4K,
    facingMode: CameraFacingMode.ENVIRONMENT,
  });
  const { ref: canvasRef, dimensions: canvasDimensions } = useCameraCanvas({
    resolution,
    streamDimensions,
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
      handle={{ takePicture, error, retry, isLoading, dimensions: streamDimensions }}
      cameraPreview={cameraPreview}
      {...((hudProps ?? {}) as T)}
    />
  ) : (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 10,
          boxSizing: 'border-box',
          maxWidth: '100dvw',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        <div style={{ paddingBottom: 20 }}>Media Query : {debug.mediaQuery}</div>
        <div style={{ paddingBottom: 20 }}>
          Stream Dimensions : {`${streamDimensions?.width}x${streamDimensions?.height}`}
        </div>
        <div style={{ paddingBottom: 20 }}>Count : {count}</div>
        <button style={{ zIndex: 99999 }} onClick={() => setCount((c) => c + 1)}>
          Re-render
        </button>
        <div>Resize Call Count : {log}</div>
      </div>
      {cameraPreview}
    </div>
  );
}
