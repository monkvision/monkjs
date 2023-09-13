const handleErrorMock = jest.fn();
jest.mock('@monkvision/monitoring', () => ({
  useMonitoring: jest.fn(() => ({ handleError: handleErrorMock })),
}));

import { act, renderHook, waitFor } from '@testing-library/react';
import { UserMediaErrorType } from '../../../src';
import { InvalidStreamErrorName, useUserMedia } from '../../../src/Camera/hooks';
import { GetUserMediaMock, mockGetUserMedia } from '../../mocks';

describe('useUserMedia hook', () => {
  let gumMock: GetUserMediaMock | null = null;

  beforeEach(() => {
    gumMock = mockGetUserMedia();
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
      expect(gumMock?.getUserMediaSpy).toHaveBeenCalledTimes(1);
      expect(gumMock?.getUserMediaSpy).toHaveBeenCalledWith(constraints);
    });
    unmount();
  });

  it('should return the stream obtained with getUserMedia in case of success', async () => {
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
        dimensions: gumMock?.tracks[0].getSettings(),
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
        dimensions: null,
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

  it('should return an InvalidStream error if the stream has no tracks', async () => {
    mockGetUserMedia({ tracks: [] });
    const { result, unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(result.current).toEqual({
        stream: null,
        dimensions: null,
        error: {
          type: UserMediaErrorType.INVALID_STREAM,
          nativeError: expect.objectContaining({ name: InvalidStreamErrorName.NO_VIDEO_TRACK }),
        },
        isLoading: false,
        retry: expect.any(Function),
      });
    });
    unmount();
  });

  it('should return an InvalidStream error if the stream has more than one track', async () => {
    const tracks = [
      {
        kind: 'video',
        applyConstraints: jest.fn(() => Promise.resolve(undefined)),
        getSettings: jest.fn(() => ({ width: 456, height: 123 })),
      },
      {
        kind: 'video',
        applyConstraints: jest.fn(() => Promise.resolve(undefined)),
        getSettings: jest.fn(() => ({ width: 456, height: 123 })),
      },
    ] as unknown as MediaStreamTrack[];
    mockGetUserMedia({ tracks });
    const { result, unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(result.current).toEqual({
        stream: null,
        dimensions: null,
        error: {
          type: UserMediaErrorType.INVALID_STREAM,
          nativeError: expect.objectContaining({
            name: InvalidStreamErrorName.TOO_MANY_VIDEO_TRACKS,
          }),
        },
        isLoading: false,
        retry: expect.any(Function),
      });
    });
    unmount();
  });

  it("should return an InvalidStream error if the stream's track has no dimensions", async () => {
    const invalidSettings = [{ width: 456 }, { height: 123 }, {}];
    for (let i = 0; i < invalidSettings.length; i++) {
      const tracks = [
        {
          kind: 'video',
          applyConstraints: jest.fn(() => Promise.resolve(undefined)),
          getSettings: jest.fn(() => invalidSettings[i]),
        },
      ] as unknown as MediaStreamTrack[];
      mockGetUserMedia({ tracks });
      const { result, unmount } = renderHook(useUserMedia);
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => {
        expect(result.current).toEqual({
          stream: null,
          dimensions: null,
          error: {
            type: UserMediaErrorType.INVALID_STREAM,
            nativeError: expect.objectContaining({
              name: InvalidStreamErrorName.NO_DIMENSIONS,
            }),
          },
          isLoading: false,
          retry: expect.any(Function),
        });
      });
      unmount();
    }
  });

  it('should return an OtherType error in case of unknown error', async () => {
    const nativeError = new Error('hello');
    mockGetUserMedia({ createMock: () => jest.fn(() => Promise.reject(nativeError)) });
    const { result, unmount } = renderHook(useUserMedia);
    await waitFor(() => {
      expect(result.current).toEqual({
        stream: null,
        dimensions: null,
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
      expect(handleErrorMock).toHaveBeenCalledWith(nativeError);
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
      expect(mock.getUserMediaSpy).toHaveBeenCalledTimes(2);
    });
    unmount();
  });

  it('should stop the stream and call getUserMedia again when the constraints change', async () => {
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
      expect(gumMock?.stream.removeEventListener).toHaveBeenCalledWith(
        'inactive',
        expect.any(Function),
      );
      gumMock?.tracks.forEach((track) => {
        expect(track.stop).toHaveBeenCalled();
      });
      expect(gumMock?.getUserMediaSpy).toHaveBeenCalledWith(newConstraints);
    });
    unmount();
  });
});
