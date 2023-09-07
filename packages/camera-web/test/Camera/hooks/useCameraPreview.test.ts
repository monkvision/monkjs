const handleErrorMock = jest.fn();
jest.mock('@monkvision/monitoring', () => ({
  useMonitoring: jest.fn(() => ({ handleError: handleErrorMock })),
}));

const constraints: MediaStreamConstraints = { audio: false, video: true };
const useMediaConstraintsMock = jest.fn(() => constraints);
jest.mock('../../../src/Camera/hooks/useMediaConstraints', () => ({
  ...jest.requireActual('../../../src/Camera/hooks/useMediaConstraints'),
  useMediaConstraints: useMediaConstraintsMock,
}));

let stream = { id: 'test-stream-id' };
const error = { type: 'other', nativeError: null };
const retry = jest.fn();
const useUserMediaMock = jest.fn(() => ({ stream, error, retry }));
jest.mock('../../../src/Camera/hooks/useUserMedia', () => ({
  ...jest.requireActual('../../../src/Camera/hooks/useUserMedia'),
  useUserMedia: useUserMediaMock,
}));

import { renderHook, waitFor } from '@testing-library/react';
import { CameraFacingMode, CameraConfig, CameraResolution } from '../../../src';
import { useCameraPreview } from '../../../src/Camera/hooks';

describe('useCameraPreview hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a call to useMediaConstraints with the given camera options', async () => {
    const { unmount, rerender } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(useMediaConstraintsMock).toHaveBeenCalledWith(undefined);
    });
    const options: CameraConfig = {
      deviceId: 'test-id',
      facingMode: CameraFacingMode.USER,
      quality: { resolution: CameraResolution.QHD_2K },
    };
    rerender({ options });
    await waitFor(() => {
      expect(useMediaConstraintsMock).toHaveBeenCalledWith(options);
    });
    unmount();
  });

  it('should make a call to useUserMedia with constraints obtained from useUserMedia', async () => {
    const { unmount } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(useUserMediaMock).toHaveBeenCalledWith(constraints);
    });
    unmount();
  });

  it('should return the stream, error and retry values from useUserMedia', async () => {
    const { result, unmount } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(result.current.stream).toEqual(stream);
      expect(result.current.error).toEqual(error);
      expect(result.current.retry).toEqual(retry);
    });
    unmount();
  });

  it('should update the srcObject property of the videoRef', async () => {
    const { result, unmount, rerender } = renderHook(useCameraPreview);

    stream = { id: 'new-stream-id' };
    const videoEl = {} as HTMLVideoElement;
    Object.defineProperty(result.current.ref, 'current', {
      value: videoEl,
      configurable: true,
      writable: true,
    });
    rerender();

    await waitFor(() => {
      expect(videoEl.srcObject).toEqual(stream);
    });
    unmount();
  });

  it('should auto-play the video when the stream is fetched', async () => {
    const { result, unmount, rerender } = renderHook(useCameraPreview);

    stream = { id: 'new-stream-id-2' };
    const videoEl = {
      play: jest.fn(() => Promise.resolve(undefined)),
    } as unknown as HTMLVideoElement;
    const spy = jest.spyOn(videoEl, 'play');
    Object.defineProperty(result.current.ref, 'current', {
      value: videoEl,
      configurable: true,
      writable: true,
    });
    rerender();

    await waitFor(() => {
      expect(typeof videoEl.onloadedmetadata).toBe('function');
      if (videoEl.onloadedmetadata) {
        videoEl.onloadedmetadata({} as Event);
      }
      expect(spy).toHaveBeenCalledTimes(1);
    });
    unmount();
  });

  it('should make a call to Monitoring.handleError if the play callback fails', async () => {
    const { result, unmount, rerender } = renderHook(useCameraPreview);

    stream = { id: 'new-stream-id-45' };
    const playError = new Error('test');
    const videoEl = {
      play: jest.fn(() => Promise.reject(playError)),
    } as unknown as HTMLVideoElement;
    Object.defineProperty(result.current.ref, 'current', {
      value: videoEl,
      configurable: true,
      writable: true,
    });
    rerender();

    await waitFor(() => {
      expect(typeof videoEl.onloadedmetadata).toBe('function');
      if (videoEl.onloadedmetadata) {
        videoEl.onloadedmetadata({} as Event);
      }
      expect(handleErrorMock).toHaveBeenCalledWith(playError);
    });
    unmount();
  });
});
