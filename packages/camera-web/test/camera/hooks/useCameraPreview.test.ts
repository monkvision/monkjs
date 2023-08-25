import { renderHook, waitFor } from '@testing-library/react';
import * as UseMediaConstraintsModule from '../../../src/camera/hooks/useMediaConstraints';
import * as UseUserMediaModule from '../../../src/camera/hooks/useUserMedia';
import {
  CameraFacingMode,
  CameraOptions,
  CameraResolution,
  useCameraPreview,
  UserMediaError,
  UserMediaErrorType,
} from '../../../src';
import { mockUseMonitoring, UseMonitoringMock } from '../../mocks';

jest.mock('@monkvision/monitoring');
jest.mock('../../../src/camera/hooks/useMediaConstraints');
jest.mock('../../../src/camera/hooks/useUserMedia');

describe('useCameraPreview hook', () => {
  let useMonitoringMock: UseMonitoringMock | null = null;
  const constraints: MediaStreamConstraints = { audio: false, video: true };
  let stream = { id: 'test-stream-id' } as MediaStream;
  const error: UserMediaError = { type: UserMediaErrorType.OTHER, nativeError: null };
  const retry = () => {};

  beforeEach(() => {
    useMonitoringMock = mockUseMonitoring();
    Object.defineProperty(UseMediaConstraintsModule, 'useMediaConstraints', {
      value: jest.fn(() => constraints),
      configurable: true,
      writable: true,
    });
    Object.defineProperty(UseUserMediaModule, 'useUserMedia', {
      value: jest.fn(() => ({ stream, error, retry })),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a call to useMediaConstraints with the given camera options', async () => {
    const spy = jest.spyOn(UseMediaConstraintsModule, 'useMediaConstraints');
    const { unmount, rerender } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(undefined);
    });
    const options: CameraOptions = {
      deviceId: 'test-id',
      facingMode: CameraFacingMode.USER,
      quality: { resolution: CameraResolution.QHD_2K },
    };
    rerender({ options });
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(options);
    });
    unmount();
  });

  it('should make a call to useUserMedia with constraints obtained from useUserMedia', async () => {
    const spy = jest.spyOn(UseUserMediaModule, 'useUserMedia');
    const { unmount } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(constraints);
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

    stream = { id: 'new-stream-id' } as MediaStream;
    const videoEl = {} as HTMLVideoElement;
    Object.defineProperty(result.current.videoRef, 'current', {
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

    stream = { id: 'new-stream-id' } as MediaStream;
    const videoEl = {
      play: jest.fn(() => Promise.resolve(undefined)),
    } as unknown as HTMLVideoElement;
    const spy = jest.spyOn(videoEl, 'play');
    Object.defineProperty(result.current.videoRef, 'current', {
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

    stream = { id: 'new-stream-id' } as MediaStream;
    const playError = new Error('test');
    const videoEl = {
      play: jest.fn(() => Promise.reject(playError)),
    } as unknown as HTMLVideoElement;
    Object.defineProperty(result.current.videoRef, 'current', {
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
      expect(useMonitoringMock?.spys.handleError).toHaveBeenCalledWith(playError);
    });
    unmount();
  });
});
