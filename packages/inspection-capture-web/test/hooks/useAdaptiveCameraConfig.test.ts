import { renderHook } from '@testing-library/react-hooks';
import { useAdaptiveCameraConfig, UseAdaptiveCameraConfigOptions } from '../../src/hooks';
import { CameraResolution, CompressionFormat } from '@monkvision/types';
import { act } from '@testing-library/react';

function createProps(): UseAdaptiveCameraConfigOptions {
  return {
    initialCameraConfig: {},
    useAdaptiveImageQuality: true,
  };
}

describe('useAdaptiveCameraConfigTest hook', () => {
  it('should use the proper default values', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useAdaptiveCameraConfig, { initialProps });

    expect(result.current.adaptiveCameraConfig.resolution).toEqual(CameraResolution.UHD_4K);
    expect(result.current.adaptiveCameraConfig.format).toEqual(CompressionFormat.JPEG);
    expect(result.current.adaptiveCameraConfig.quality).toEqual(0.6);
    expect(result.current.adaptiveCameraConfig.allowImageUpscaling).toEqual(false);

    unmount();
  });

  it('should use the values passed as the argument', () => {
    const initialProps = createProps();
    initialProps.initialCameraConfig.resolution = CameraResolution.NHD_360P;
    initialProps.initialCameraConfig.format = CompressionFormat.JPEG;
    initialProps.initialCameraConfig.quality = 0.3;
    initialProps.initialCameraConfig.allowImageUpscaling = true;
    const { result, unmount } = renderHook(useAdaptiveCameraConfig, { initialProps });

    expect(result.current.adaptiveCameraConfig).toEqual(initialProps.initialCameraConfig);
    unmount();
  });

  it('should lower the max image quality after long uploads', () => {
    const initialProps = createProps();
    initialProps.initialCameraConfig.resolution = CameraResolution.UHD_4K;
    initialProps.initialCameraConfig.quality = 1;
    initialProps.initialCameraConfig.allowImageUpscaling = true;
    const { result, unmount } = renderHook(useAdaptiveCameraConfig, { initialProps });

    expect(result.current.adaptiveCameraConfig.resolution).toEqual(
      initialProps.initialCameraConfig.resolution,
    );
    act(() => result.current.uploadEventHandlers.onUploadSuccess?.({ durationMs: 15001 }));
    expect(result.current.adaptiveCameraConfig.resolution).toEqual(CameraResolution.QHD_2K);
    expect(result.current.adaptiveCameraConfig.quality).toEqual(0.6);
    expect(result.current.adaptiveCameraConfig.allowImageUpscaling).toEqual(false);

    unmount();
  });

  it('should not lower the max image quality after short uploads', () => {
    const initialProps = createProps();
    initialProps.initialCameraConfig.resolution = CameraResolution.UHD_4K;
    initialProps.initialCameraConfig.quality = 1;
    initialProps.initialCameraConfig.allowImageUpscaling = true;
    const { result, unmount } = renderHook(useAdaptiveCameraConfig, { initialProps });

    expect(result.current.adaptiveCameraConfig.resolution).toEqual(
      initialProps.initialCameraConfig.resolution,
    );
    act(() => result.current.uploadEventHandlers.onUploadSuccess?.({ durationMs: 200 }));
    expect(result.current.adaptiveCameraConfig).toEqual(
      expect.objectContaining(initialProps.initialCameraConfig),
    );

    unmount();
  });

  it('should lower the max image quality after timeout uploads', () => {
    const initialProps = createProps();
    initialProps.initialCameraConfig.resolution = CameraResolution.UHD_4K;
    initialProps.initialCameraConfig.quality = 1;
    initialProps.initialCameraConfig.allowImageUpscaling = true;
    const { result, unmount } = renderHook(useAdaptiveCameraConfig, { initialProps });

    expect(result.current.adaptiveCameraConfig.resolution).toEqual(
      initialProps.initialCameraConfig.resolution,
    );
    act(() => result.current.uploadEventHandlers.onUploadTimeout?.());
    expect(result.current.adaptiveCameraConfig.resolution).toEqual(CameraResolution.QHD_2K);
    expect(result.current.adaptiveCameraConfig.quality).toEqual(0.6);
    expect(result.current.adaptiveCameraConfig.allowImageUpscaling).toEqual(false);

    unmount();
  });

  it('should not modify the asked image quality after adapting if it is already low', () => {
    const initialProps = createProps();
    initialProps.initialCameraConfig.resolution = CameraResolution.QNHD_180P;
    initialProps.initialCameraConfig.quality = 0.3;
    initialProps.initialCameraConfig.allowImageUpscaling = false;
    const { result, unmount } = renderHook(useAdaptiveCameraConfig, { initialProps });

    expect(result.current.adaptiveCameraConfig.resolution).toEqual(
      initialProps.initialCameraConfig.resolution,
    );
    act(() => result.current.uploadEventHandlers.onUploadTimeout?.());
    expect(result.current.adaptiveCameraConfig.resolution).toEqual(
      initialProps.initialCameraConfig.resolution,
    );

    unmount();
  });

  it('should not adapt if not asked to', () => {
    const initialProps = createProps();
    initialProps.initialCameraConfig.resolution = CameraResolution.UHD_4K;
    initialProps.initialCameraConfig.format = CompressionFormat.JPEG;
    initialProps.initialCameraConfig.quality = 1;
    initialProps.initialCameraConfig.allowImageUpscaling = true;
    initialProps.useAdaptiveImageQuality = false;
    const { result, unmount } = renderHook(useAdaptiveCameraConfig, { initialProps });

    expect(result.current.adaptiveCameraConfig).toEqual(initialProps.initialCameraConfig);
    act(() => result.current.uploadEventHandlers.onUploadTimeout?.());
    expect(result.current.adaptiveCameraConfig).toEqual(initialProps.initialCameraConfig);

    unmount();
  });
});
