import { act, renderHook, waitFor } from '@testing-library/react';
import { UserMediaErrorType, useUserMedia } from '../../../src';
import {
  GetUserMediaMock,
  mockGetUserMedia,
  mockUseMonitoring,
  UseMonitoringMock,
} from '../../mocks';

jest.mock('@monkvision/monitoring');

describe('useUserMedia hook', () => {
  let gumMock: GetUserMediaMock | null = null;
  let useMonitoringMock: UseMonitoringMock | null = null;

  beforeEach(() => {
    gumMock = mockGetUserMedia();
    useMonitoringMock = mockUseMonitoring();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a call to the getUserMedia with the given constraints', async () => {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 123, height: 456 },
    };
    const { unmount } = renderHook(useUserMedia, {
      initialProps: constraints,
    });
    await waitFor(() => {
      expect(gumMock?.spys.getUserMedia).toHaveBeenCalledTimes(1);
      expect(gumMock?.spys.getUserMedia).toHaveBeenCalledWith(constraints);
    });
    unmount();
  });

  it('should return the stream obtain with getUserMedia in case of success', async () => {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 123, height: 456 },
    };
    const { result, unmount } = renderHook(useUserMedia, {
      initialProps: constraints,
    });
    await waitFor(() => {
      expect(result.current).toEqual({
        stream: gumMock?.stream,
        error: null,
        isLoading: false,
        retry: expect.any(Function),
      });
    });
    unmount();
  });

  it('should be loading while the stream is being fetched', async () => {
    let done = false;
    mockGetUserMedia({
      createMock: (stream) =>
        jest.fn(
          () =>
            new Promise((resolve) => {
              const intervalId = setInterval(() => {
                if (done) {
                  resolve(stream);
                  clearInterval(intervalId);
                }
              }, 300);
            }),
        ),
    });
    const { result, unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
    done = true;
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    unmount();
  });

  it('should return a NotAllowed error in case of camera permission error', async () => {
    const nativeError = new Error();
    nativeError.name = 'NotAllowedError';
    mockGetUserMedia({ createMock: () => jest.fn(() => Promise.reject(nativeError)) });
    const { result, unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(result.current).toEqual({
        stream: null,
        error: {
          type: UserMediaErrorType.NOT_ALLOWED,
          nativeError,
        },
        isLoading: false,
        retry: expect.any(Function),
      });
    });
    unmount();
  });

  it('should return an OtherType error in case of unknown error', async () => {
    const nativeError = new Error('hello');
    mockGetUserMedia({ createMock: () => jest.fn(() => Promise.reject(nativeError)) });
    const { result, unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(result.current).toEqual({
        stream: null,
        error: {
          type: UserMediaErrorType.OTHER,
          nativeError,
        },
        isLoading: false,
        retry: expect.any(Function),
      });
    });
    unmount();
  });

  it('should call handleError in case of an error', async () => {
    const nativeError = new Error('test');
    mockGetUserMedia({ createMock: () => jest.fn(() => Promise.reject(nativeError)) });
    const { unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(useMonitoringMock?.spys.handleError).toHaveBeenCalledWith(nativeError);
    });
    unmount();
  });

  it('should provide a working retry function', async () => {
    let gumCallCount = 0;
    const nativeError = new Error('test');
    const mock = mockGetUserMedia({
      createMock: (stream) =>
        jest.fn(() => {
          gumCallCount += 1;
          return gumCallCount === 1 ? Promise.reject(nativeError) : Promise.resolve(stream);
        }),
    });
    const { result, unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(result.current.error?.type).toEqual(UserMediaErrorType.OTHER);
    });
    act(() => {
      result.current.retry();
    });
    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.stream).toEqual(mock.stream);
      expect(mock.spys.getUserMedia).toHaveBeenCalledTimes(2);
    });
    unmount();
  });

  it('should call applyConstraints when the constraints change', async () => {
    const initialConstraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 356, height: 234 },
    };
    const { result, unmount, rerender } = renderHook(useUserMedia, {
      initialProps: initialConstraints,
    });
    await waitFor(() => {
      expect(result.current.stream).toEqual(gumMock?.stream);
    });
    const newConstraints: MediaStreamConstraints = {
      audio: true,
      video: {
        deviceId: 'test-id',
        width: 3444,
        height: 7953,
      },
    };
    rerender(newConstraints);
    await waitFor(() => {
      expect(gumMock?.spys.tracksApplyConstraints[0]).toHaveBeenCalledWith(newConstraints.video);
    });
    unmount();
  });
});
