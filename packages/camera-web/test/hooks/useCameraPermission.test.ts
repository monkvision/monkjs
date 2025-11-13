const stop = jest.fn();
const constraints = { test: 'hello' };

jest.mock('../../src/Camera/hooks', () => ({
  ...jest.requireActual('../../src/Camera/hooks'),
  useUserMedia: jest.fn(() => ({
    getUserMedia: jest.fn(() =>
      Promise.resolve({
        getTracks: jest.fn(() => [{ stop }, { stop }]),
      }),
    ),
  })),
}));
jest.mock('../../src/Camera/hooks/utils', () => ({
  ...jest.requireActual('../../src/Camera/hooks/utils'),
  getMediaConstraints: jest.fn(() => constraints),
}));

import { CameraResolution } from '@monkvision/types';
import { renderHook } from '@testing-library/react';
import { isMobileDevice } from '@monkvision/common';
import { CameraFacingMode, useCameraPermission } from '../../src';
import { useUserMedia } from '../../src/Camera/hooks';
import { getMediaConstraints } from '../../src/Camera/hooks/utils';

describe('useCameraPermission hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a call to the getUserMedia function when asking for permissions', async () => {
    (isMobileDevice as jest.Mock).mockImplementationOnce(() => true);
    const { result, unmount } = renderHook(useCameraPermission);

    expect(getMediaConstraints).toHaveBeenCalledWith({
      resolution: CameraResolution.UHD_4K,
      facingMode: CameraFacingMode.ENVIRONMENT,
    });
    expect(useUserMedia).toHaveBeenCalledWith(constraints, null);
    const { getUserMedia } = (useUserMedia as jest.Mock).mock.results[0].value;

    expect(getUserMedia).not.toHaveBeenCalled();
    await result.current.requestCameraPermission();
    expect(getUserMedia).toHaveBeenCalled();

    unmount();
  });

  it('should switch to FHD_1080P in desktop', async () => {
    (isMobileDevice as jest.Mock).mockImplementationOnce(() => false);
    const { unmount } = renderHook(useCameraPermission);

    expect(getMediaConstraints).toHaveBeenCalledWith({
      resolution: CameraResolution.FHD_1080P,
      facingMode: CameraFacingMode.ENVIRONMENT,
    });

    unmount();
  });

  it('should stop the stream after fetching it', async () => {
    const { result, unmount } = renderHook(useCameraPermission);

    await result.current.requestCameraPermission();
    expect(stop).toHaveBeenCalledTimes(2);

    unmount();
  });
});
