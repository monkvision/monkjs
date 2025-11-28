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

import { CameraResolution } from '@monkvision/types';
import { render, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as monitoring from '@monkvision/monitoring';
import { MonitoringAdapter } from '@monkvision/monitoring';
import { useWindowDimensions } from '@monkvision/common';
import { CameraFacingMode, CameraConfig } from '../../../src';
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

  it('should make a call to useUserMedia with constraints obtained from useUserMedia and the video ref', async () => {
    const { result, unmount } = renderHook(useCameraPreview);
    await waitFor(() => {
      expect(useUserMedia).toHaveBeenCalled();
      const { calls } = (useUserMedia as jest.Mock).mock;
      expect(calls.length).toBeGreaterThan(0);
      const [constraints, ref] = calls[calls.length - 1];
      expect(constraints).toBeDefined();
      expect(ref).toBe(result.current.ref);
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
    const newStream = { id: 'new-stream-id' } as MediaStream;
    (useUserMedia as jest.Mock).mockImplementation(() => ({
      stream: newStream,
      error: null,
      retry: jest.fn(),
    }));

    const { result, unmount, rerender } = renderHook(useCameraPreview);
    const { unmount: unmountRender } = render(
      <video ref={result.current.ref} data-testid='test-video' />,
    );

    await waitFor(() => {
      expect(result.current.ref.current).toBeDefined();
    });

    // Trigger effect to run by rerendering the hook
    await act(async () => {
      rerender();
    });

    await waitFor(
      () => {
        expect(result.current.ref.current?.srcObject).toEqual(newStream);
      },
      { timeout: 3000 },
    );

    unmountRender();
    unmount();
  });

  it('should auto-play the video when the stream is fetched', async () => {
    const testStream = { id: 'test-stream' } as MediaStream;
    (useUserMedia as jest.Mock).mockImplementation(() => ({
      stream: testStream,
      error: null,
      retry: jest.fn(),
    }));

    const { result, unmount, rerender } = renderHook(useCameraPreview);
    const { ref } = result.current;

    const { unmount: unmountRender } = render(<video ref={ref} data-testid='test-video' />);

    await waitFor(() => {
      expect(ref.current).toBeDefined();
    });

    const current = ref.current as HTMLVideoElement;
    const spy = jest.spyOn(current, 'play').mockImplementation(() => Promise.resolve());

    await act(async () => {
      rerender();
    });

    await waitFor(() => {
      expect(current.onloadedmetadata).toBeDefined();
      expect(typeof current.onloadedmetadata).toBe('function');
    });

    if (current.onloadedmetadata) {
      current.onloadedmetadata({} as Event);
    }

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

    spy.mockRestore();
    unmountRender();
    unmount();
  });

  it('should return nuyll preview dimensions if the window dimensions or stream dimensions are null', () => {
    (useWindowDimensions as jest.Mock).mockImplementationOnce(() => null);
    (useUserMedia as jest.Mock).mockImplementationOnce(() => ({
      dimensions: { width: 3840, height: 2160 },
    }));
    const { result, rerender, unmount } = renderHook(useCameraPreview);

    expect(result.current.previewDimensions).toBeNull();

    (useWindowDimensions as jest.Mock).mockImplementationOnce(() => ({
      width: 1920,
      height: 1080,
    }));
    (useUserMedia as jest.Mock).mockImplementationOnce(() => ({ dimensions: null }));
    rerender();
    expect(result.current.previewDimensions).toBeNull();

    unmount();
  });

  it('should return the proper preview dimensions when the aspect ratios are the same', async () => {
    (useWindowDimensions as jest.Mock).mockImplementation(() => ({
      width: 1920,
      height: 1080,
    }));
    const testStream = { id: 'test-stream' } as MediaStream;
    (useUserMedia as jest.Mock).mockImplementation(() => ({
      stream: testStream,
      error: null,
      retry: jest.fn(),
    }));
    const { result, unmount, rerender } = renderHook(useCameraPreview);
    const { ref } = result.current;

    const { unmount: unmountRender } = render(<video ref={ref} data-testid='test-video' />);

    await waitFor(() => {
      expect(ref.current).toBeDefined();
    });

    const current = ref.current as HTMLVideoElement;
    Object.defineProperty(current, 'videoWidth', { value: 3840, writable: true });
    Object.defineProperty(current, 'videoHeight', { value: 2160, writable: true });
    jest.spyOn(current, 'play').mockImplementation(() => Promise.resolve());

    // Trigger effect to run by rerendering the hook
    await act(async () => {
      rerender();
    });

    await waitFor(() => {
      expect(current.onloadedmetadata).toBeDefined();
      expect(typeof current.onloadedmetadata).toBe('function');
    });

    if (current.onloadedmetadata) {
      current.onloadedmetadata({} as Event);
    }

    await waitFor(() => {
      expect(result.current.previewDimensions).not.toBeNull();
      expect(result.current.previewDimensions?.width).toEqual(1920);
      expect(result.current.previewDimensions?.height).toEqual(1080);
    });

    unmountRender();
    unmount();
  });

  it('should return the proper preview dimensions when the window width is larger', async () => {
    (useWindowDimensions as jest.Mock).mockImplementation(() => ({
      width: 1920,
      height: 1080,
    }));
    const testStream = { id: 'test-stream' } as MediaStream;
    (useUserMedia as jest.Mock).mockImplementation(() => ({
      stream: testStream,
      error: null,
      retry: jest.fn(),
    }));
    const { result, unmount, rerender } = renderHook(useCameraPreview);
    const { ref } = result.current;

    const { unmount: unmountRender } = render(<video ref={ref} data-testid='test-video' />);

    await waitFor(() => {
      expect(ref.current).toBeDefined();
    });

    const current = ref.current as HTMLVideoElement;
    Object.defineProperty(current, 'videoWidth', { value: 500, writable: true });
    Object.defineProperty(current, 'videoHeight', { value: 600, writable: true });
    jest.spyOn(current, 'play').mockImplementation(() => Promise.resolve());

    await act(async () => {
      rerender();
    });

    await waitFor(() => {
      expect(current.onloadedmetadata).toBeDefined();
      expect(typeof current.onloadedmetadata).toBe('function');
    });

    if (current.onloadedmetadata) {
      current.onloadedmetadata({} as Event);
    }

    await waitFor(() => {
      expect(result.current.previewDimensions).not.toBeNull();
      expect(result.current.previewDimensions?.width).toEqual((1080 * 500) / 600);
      expect(result.current.previewDimensions?.height).toEqual(1080);
    });

    unmountRender();
    unmount();
  });

  it('should return the proper preview dimensions when the window height is larger', async () => {
    (useWindowDimensions as jest.Mock).mockImplementation(() => ({
      width: 1440,
      height: 1080,
    }));
    const testStream = { id: 'test-stream' } as MediaStream;
    (useUserMedia as jest.Mock).mockImplementation(() => ({
      stream: testStream,
      error: null,
      retry: jest.fn(),
    }));
    const { result, unmount, rerender } = renderHook(useCameraPreview);
    const { ref } = result.current;

    const { unmount: unmountRender } = render(<video ref={ref} data-testid='test-video' />);

    await waitFor(() => {
      expect(ref.current).toBeDefined();
    });

    const current = ref.current as HTMLVideoElement;
    Object.defineProperty(current, 'videoWidth', { value: 3840, writable: true });
    Object.defineProperty(current, 'videoHeight', { value: 2160, writable: true });
    jest.spyOn(current, 'play').mockImplementation(() => Promise.resolve());

    await act(async () => {
      rerender();
    });

    await waitFor(() => {
      expect(current.onloadedmetadata).toBeDefined();
      expect(typeof current.onloadedmetadata).toBe('function');
    });

    if (current.onloadedmetadata) {
      current.onloadedmetadata({} as Event);
    }

    await waitFor(() => {
      expect(result.current.previewDimensions).not.toBeNull();
      expect(result.current.previewDimensions?.width).toEqual(1440);
      expect(result.current.previewDimensions?.height).toEqual((1440 * 2160) / 3840);
    });

    unmountRender();
    unmount();
  });

  it('should make a call to Monitoring.handleError if the play callback fails', async () => {
    const playError = new Error('test');
    const handleErrorMock = jest.fn();
    const testStream = { id: 'test-stream' } as MediaStream;

    jest.spyOn(monitoring, 'useMonitoring').mockImplementation(
      () =>
        ({
          handleError: handleErrorMock,
        } as unknown as MonitoringAdapter),
    );

    (useUserMedia as jest.Mock).mockImplementation(() => ({
      stream: testStream,
      error: null,
      retry: jest.fn(),
    }));

    const { result, unmount, rerender } = renderHook(useCameraPreview);
    const { ref } = result.current;

    const { unmount: unmountRender } = render(<video ref={ref} data-testid='test-video' />);

    await waitFor(() => {
      expect(ref.current).toBeDefined();
    });

    const current = ref.current as HTMLVideoElement;
    jest.spyOn(current, 'play').mockImplementation(() => Promise.reject(playError));

    await act(async () => {
      rerender();
    });

    await waitFor(() => {
      expect(current.onloadedmetadata).toBeDefined();
      expect(typeof current.onloadedmetadata).toBe('function');
    });

    if (current.onloadedmetadata) {
      current.onloadedmetadata({} as Event);
    }

    await waitFor(() => {
      expect(handleErrorMock).toHaveBeenCalledWith(playError);
    });

    unmountRender();
    unmount();
  });
});
