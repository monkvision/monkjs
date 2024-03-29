jest.mock('../../../src/Camera/hooks/utils', () => ({
  ...jest.requireActual('../../../src/Camera/hooks/utils'),
  getMediaConstraints: jest.fn(() => ({ audio: false, video: true })),
}));
jest.mock('../../../src/Camera/hooks/useUserMedia', () => ({
  ...jest.requireActual('../../../src/Camera/hooks/useUserMedia'),
  useUserMedia: jest.fn(() => ({
    stream: { id: 'test-stream-id' },
    error: { type: 'other', nativeError: null },
    retry: jest.fn(),
  })),
}));

import { render, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as monitoring from '@monkvision/monitoring';
import { MonitoringAdapter } from '@monkvision/monitoring';
import { CameraFacingMode, CameraConfig, CameraResolution } from '../../../src';
import { useCameraPreview, useUserMedia } from '../../../src/Camera/hooks';
import { getMediaConstraints } from '../../../src/Camera/hooks/utils';

describe('useCameraPreview hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a call to useMediaConstraints with the given camera options', async () => {
    const { unmount, rerender } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(getMediaConstraints).toHaveBeenCalledWith(undefined);
    });
    const options: CameraConfig = {
      facingMode: CameraFacingMode.USER,
      resolution: CameraResolution.QHD_2K,
    };
    rerender(options);
    await waitFor(() => {
      expect(getMediaConstraints).toHaveBeenCalledWith(options);
    });
    unmount();
  });

  it('should make a call to useUserMedia with constraints obtained from useUserMedia', async () => {
    const { unmount } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(useUserMedia).toHaveBeenCalledWith((getMediaConstraints as jest.Mock)());
    });
    unmount();
  });

  it('should return the stream, error and retry values from useUserMedia', async () => {
    const stream = { id: 'test-test-test' };
    const error = { type: 'wow', nativeError: null };
    const retry = jest.fn();
    (useUserMedia as jest.Mock).mockImplementationOnce(() => ({ stream, error, retry }));
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

    const { ref } = result.current;
    const newStream = { id: 'new-stream-id' };
    (useUserMedia as jest.Mock).mockImplementationOnce(() => ({
      stream: newStream,
      error: null,
      retry: jest.fn(),
    }));
    const { unmount: unmountRender } = render(<video ref={ref} />);
    rerender();

    await waitFor(() => {
      expect(ref.current?.srcObject).toEqual(newStream);
    });
    unmountRender();
    unmount();
  });

  it('should auto-play the video when the stream is fetched', async () => {
    const { result, unmount, rerender } = renderHook(useCameraPreview);

    const { ref } = result.current;
    const { unmount: unmountRender } = render(<video ref={ref} />);

    expect(ref.current).toBeDefined();
    const current = ref.current as HTMLVideoElement;
    const spy = jest.spyOn(current, 'play').mockImplementation(() => Promise.resolve());
    rerender();

    await waitFor(() => {
      expect(typeof current.onloadedmetadata).toBe('function');
      if (current.onloadedmetadata) {
        current.onloadedmetadata({} as Event);
      }
      expect(spy).toHaveBeenCalledTimes(1);
    });
    unmountRender();
    unmount();
  });

  it('should make a call to Monitoring.handleError if the play callback fails', async () => {
    const { result, unmount, rerender } = renderHook(useCameraPreview);

    const { ref } = result.current;
    const playError = new Error('test');
    const { unmount: unmountRender } = render(<video ref={ref} />);
    expect(ref.current).toBeDefined();
    const current = ref.current as HTMLVideoElement;
    const handleErrorMock = jest.fn();
    jest.spyOn(current, 'play').mockImplementation(() => Promise.reject(playError));
    jest.spyOn(monitoring, 'useMonitoring').mockImplementationOnce(
      () =>
        ({
          handleError: handleErrorMock,
        } as unknown as MonitoringAdapter),
    );

    rerender();

    await waitFor(() => {
      expect(typeof current.onloadedmetadata).toBe('function');
      if (current.onloadedmetadata) {
        current.onloadedmetadata({} as Event);
      }
      expect(handleErrorMock).toHaveBeenCalledWith(playError);
    });
    unmountRender();
    unmount();
  });
});
