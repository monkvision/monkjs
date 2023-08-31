import { renderHook } from '@testing-library/react';
import { CameraFacingMode, CameraResolution } from '../../../src';
import { useMediaConstraints } from '../../../src/Camera/hooks';

const EXPECTED_FACING_MODE_VALUES: {
  [key in CameraFacingMode]: string;
} = {
  [CameraFacingMode.ENVIRONMENT]: 'environment',
  [CameraFacingMode.USER]: 'user',
};

const EXPECTED_CAMERA_RESOLUTION_SIZES: {
  [key in CameraResolution]: { width: number; height: number };
} = {
  [CameraResolution.QNHD_180P]: { width: 320, height: 180 },
  [CameraResolution.NHD_360P]: { width: 640, height: 360 },
  [CameraResolution.HD_720P]: { width: 1280, height: 720 },
  [CameraResolution.FHD_1080P]: { width: 1920, height: 1080 },
  [CameraResolution.QHD_2K]: { width: 2560, height: 1440 },
  [CameraResolution.UHD_4K]: { width: 3840, height: 2160 },
};

const DEFAULT_EXPECTED_CONSTRAINTS = {
  audio: false,
  video: {
    facingMode: 'environment',
    width: { ideal: EXPECTED_CAMERA_RESOLUTION_SIZES[CameraResolution.UHD_4K].width },
    height: { ideal: EXPECTED_CAMERA_RESOLUTION_SIZES[CameraResolution.UHD_4K].height },
  },
};

describe('useMediaConstraints hook', () => {
  it('should return the default constraints when no options are specified', () => {
    const { result, unmount } = renderHook(useMediaConstraints);
    expect(result.current).toEqual(DEFAULT_EXPECTED_CONSTRAINTS);
    unmount();
  });

  it('should properly map the deviceId option', () => {
    const deviceId = 'test-id';
    const { result, unmount } = renderHook(useMediaConstraints, {
      initialProps: { deviceId },
    });
    expect(result.current).toEqual({
      ...DEFAULT_EXPECTED_CONSTRAINTS,
      video: {
        ...DEFAULT_EXPECTED_CONSTRAINTS.video,
        deviceId,
      },
    });
    unmount();
  });

  Object.values(CameraFacingMode).forEach((facingMode) =>
    it(`should properly map the '${facingMode}' facingMode option`, () => {
      const { result, unmount } = renderHook(useMediaConstraints, {
        initialProps: { facingMode },
      });
      expect(result.current).toEqual({
        ...DEFAULT_EXPECTED_CONSTRAINTS,
        video: {
          ...DEFAULT_EXPECTED_CONSTRAINTS.video,
          facingMode: EXPECTED_FACING_MODE_VALUES[facingMode],
        },
      });
      unmount();
    }),
  );

  Object.values(CameraResolution).forEach((resolution) =>
    it(`should properly map the '${resolution}' resolution option`, () => {
      const { result, unmount } = renderHook(useMediaConstraints, {
        initialProps: { quality: { resolution } },
      });
      expect(result.current).toEqual({
        ...DEFAULT_EXPECTED_CONSTRAINTS,
        video: {
          ...DEFAULT_EXPECTED_CONSTRAINTS.video,
          width: { ideal: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].width },
          height: { ideal: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].height },
        },
      });
      unmount();
    }),
  );
});
