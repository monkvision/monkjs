import { CameraResolution } from '@monkvision/types';
import { CameraFacingMode } from '../../../../src';
import { getMediaConstraints, getResolutionDimensions } from '../../../../src/Camera/hooks/utils';

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

describe('Media Constraints utils', () => {
  describe('getResolutionDimensions function', () => {
    Object.values(CameraResolution).forEach((resolution) =>
      it(`should return the proper dimensions for the '${resolution}' resolution`, () => {
        const landscapeDimensions = getResolutionDimensions(resolution, false);
        expect(landscapeDimensions).toEqual({
          width: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].width,
          height: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].height,
        });

        const portraitDimensions = getResolutionDimensions(resolution, true);
        expect(portraitDimensions).toEqual({
          width: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].height,
          height: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].width,
        });
      }),
    );
  });

  describe('useMediaConstraints hook', () => {
    Object.values(CameraFacingMode).forEach((facingMode) =>
      it(`should properly map the '${facingMode}' facingMode option`, () => {
        const constraints = getMediaConstraints({
          facingMode,
          resolution: CameraResolution.UHD_4K,
        });

        expect(constraints).toEqual(
          expect.objectContaining({
            video: expect.objectContaining({ facingMode: EXPECTED_FACING_MODE_VALUES[facingMode] }),
          }),
        );
      }),
    );

    Object.values(CameraResolution).forEach((resolution) =>
      it(`should properly map the '${resolution}' resolution option`, () => {
        const constraints = getMediaConstraints({
          resolution,
          facingMode: CameraFacingMode.ENVIRONMENT,
        });

        expect(constraints).toEqual(
          expect.objectContaining({
            video: expect.objectContaining({
              width: { ideal: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].width },
              height: { ideal: EXPECTED_CAMERA_RESOLUTION_SIZES[resolution].height },
            }),
          }),
        );
      }),
    );
  });
});
