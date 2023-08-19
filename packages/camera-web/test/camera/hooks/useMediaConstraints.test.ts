import React from 'react';
import { CameraResolution, useMediaConstraints } from '../../../src';

jest.mock('react');

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
  beforeEach(() => {
    React.useMemo = jest.fn((callback) => callback());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the default constraints when no options are specified', () => {
    const constraints = useMediaConstraints();
    expect(constraints).toEqual(DEFAULT_EXPECTED_CONSTRAINTS);
  });
});
