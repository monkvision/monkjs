const validDeviceIds = ['id-1', 'id-2'];
const availableDevices = [{ test: 'hello' }, { test2: 'hello2' }];

jest.mock('../../../src/Camera/hooks/utils/analyzeCameraDevices', () => ({
  analyzeCameraDevices: jest.fn(() => ({ validDeviceIds, availableDevices })),
}));

import { act, waitFor } from '@testing-library/react';
import { isMobileDevice } from '@monkvision/common';
import { renderHook } from '@testing-library/react-hooks';
import { useMonitoring } from '@monkvision/monitoring';
import { UserMediaErrorType } from '../../../src';
import { InvalidStreamErrorName, useUserMedia } from '../../../src/Camera/hooks';
import { GetUserMediaMock, mockGetUserMedia } from '../../mocks';
import { analyzeCameraDevices } from '../../../src/Camera/hooks/utils';
import { RefObject } from 'react';
import { createFakePromise } from '@monkvision/test-utils';

function renderUseUserMedia(initialProps: {
  constraints: MediaStreamConstraints;
  videoRef: RefObject<HTMLVideoElement>;
}) {
  return renderHook(
    (props: { constraints: MediaStreamConstraints; videoRef: RefObject<HTMLVideoElement> }) =>
      useUserMedia(props.constraints, props.videoRef),
    { initialProps },
  );
}

describe('useUserMedia hook', () => {
  let gumMock: GetUserMediaMock | null = null;

  beforeEach(() => {
    gumMock = mockGetUserMedia();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a call to the getUserMedia with the given constraints', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 123, height: 456 },
    };
    const { unmount } = renderUseUserMedia({ constraints, videoRef });
    await waitFor(() => {
      expect(analyzeCameraDevices).toHaveBeenCalled();
      expect(gumMock?.getUserMediaSpy).toHaveBeenCalledTimes(1);
      expect(gumMock?.getUserMediaSpy).toHaveBeenCalledWith({
        ...constraints,
        video: {
          ...(constraints?.video as any),
          deviceId: { exact: validDeviceIds },
        },
      });
    });
    unmount();
  });

  it('should return the stream obtained with getUserMedia in case of success', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 123, height: 456 },
    };
    const { result, unmount } = renderUseUserMedia({ constraints, videoRef });
    const settings = gumMock?.tracks[0].getSettings();
    await waitFor(() => {
      expect(result.current).toEqual({
        stream: gumMock?.stream,
        dimensions: { width: settings?.width, height: settings?.height },
        error: null,
        isLoading: false,
        retry: expect.any(Function),
        availableCameraDevices: availableDevices,
        selectedCameraDeviceId: settings?.deviceId,
      });
    });
    unmount();
  });

  it('should be loading while the stream is being fetched', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const fakePromise = createFakePromise<MediaStream>();
    let stream = {} as MediaStream;
    mockGetUserMedia({
      createMock: (str) => {
        stream = str;
        return jest.fn(() => fakePromise);
      },
    });
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
    fakePromise.resolve(stream);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    unmount();
  });

  it('should return a NotAllowed error in case of camera permission error', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const nativeError = new Error();
    nativeError.name = 'NotAllowedError';
    mockGetUserMedia({ createMock: () => jest.fn(() => Promise.reject(nativeError)) });
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
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
        availableCameraDevices: [],
        selectedCameraDeviceId: null,
      });
    });
    unmount();
  });

  it('should return an InvalidStream error if the stream has no tracks', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    mockGetUserMedia({ tracks: [] });
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
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
        availableCameraDevices: [],
        selectedCameraDeviceId: null,
      });
    });
    unmount();
  });

  it('should return an InvalidStream error if the stream has more than one track', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const tracks = [
      {
        kind: 'video',
        applyConstraints: jest.fn(() => Promise.resolve(undefined)),
        getSettings: jest.fn(() => ({ width: 456, height: 123 })),
        stop: jest.fn(),
      },
      {
        kind: 'video',
        applyConstraints: jest.fn(() => Promise.resolve(undefined)),
        getSettings: jest.fn(() => ({ width: 456, height: 123 })),
        stop: jest.fn(),
      },
    ] as unknown as MediaStreamTrack[];
    mockGetUserMedia({ tracks });
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
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
        availableCameraDevices: [],
        selectedCameraDeviceId: null,
      });
    });
    unmount();
  });

  it("should return an InvalidStream error if the stream's track has no dimensions", async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const invalidSettings = [{ width: 456 }, { height: 123 }, {}];
    for (let i = 0; i < invalidSettings.length; i++) {
      const tracks = [
        {
          kind: 'video',
          applyConstraints: jest.fn(() => Promise.resolve(undefined)),
          getSettings: jest.fn(() => invalidSettings[i]),
          stop: jest.fn(),
        },
      ] as unknown as MediaStreamTrack[];
      mockGetUserMedia({ tracks });
      const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
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
          availableCameraDevices: [],
          selectedCameraDeviceId: null,
        });
      });
      unmount();
    }
  });

  it('should return an OtherType error in case of unknown error', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const nativeError = new Error('hello');
    mockGetUserMedia({ createMock: () => jest.fn(() => Promise.reject(nativeError)) });
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
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
        availableCameraDevices: [],
        selectedCameraDeviceId: null,
      });
    });
    unmount();
  });

  it('should call handleError in case of an error', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const nativeError = new Error('test');
    mockGetUserMedia({ createMock: () => jest.fn(() => Promise.reject(nativeError)) });
    const { unmount } = renderUseUserMedia({ constraints: {}, videoRef });

    const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;
    await waitFor(() => {
      expect(handleErrorMock).toHaveBeenCalledWith(nativeError);
    });
    unmount();
  });

  it('should provide a working retry function', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    let gumCallCount = 0;
    const nativeError = new Error('test');
    const mock = mockGetUserMedia({
      createMock: (stream) =>
        jest.fn(() => {
          gumCallCount += 1;
          return gumCallCount === 1 ? Promise.reject(nativeError) : Promise.resolve(stream);
        }),
    });
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
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
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const initialConstraints: MediaStreamConstraints = {
      audio: false,
      video: { width: 356, height: 234 },
    };
    const { result, unmount, rerender } = renderUseUserMedia({
      constraints: initialConstraints,
      videoRef,
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

    rerender({ constraints: newConstraints, videoRef });
    await waitFor(() => {
      expect(gumMock?.stream.removeEventListener).toHaveBeenCalledWith(
        'inactive',
        expect.any(Function),
      );
      gumMock?.tracks.forEach((track) => {
        expect(track.stop).toHaveBeenCalled();
      });
      expect(gumMock?.getUserMediaSpy).toHaveBeenCalledWith({
        ...newConstraints,
        video: {
          ...(newConstraints.video as any),
          deviceId: { exact: validDeviceIds },
        },
      });
    });
    unmount();
  });

  it("should switch the dimensions of the stream if it doesn't match the orientation of the mobile device", async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    (isMobileDevice as jest.Mock).mockReturnValue(true);
    (global.window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: true });
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
    await waitFor(() => {
      expect(global.window.matchMedia).toHaveBeenCalledWith('(orientation: portrait)');
      expect(result.current.dimensions).toEqual({
        height: 456,
        width: 123,
      });
    });
    unmount();
  });

  it('should not switch the dimensions of the stream on desktop', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    (isMobileDevice as jest.Mock).mockReturnValue(false);
    const { result, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
    await waitFor(() => {
      expect(result.current.dimensions).toEqual({
        height: 123,
        width: 456,
      });
    });
    unmount();
  });

  it('should update the stream dimensions when the video ref resizes', async () => {
    const videoRef = { current: {} } as RefObject<HTMLVideoElement>;
    const { result, rerender, unmount } = renderUseUserMedia({ constraints: {}, videoRef });
    await waitFor(() => {
      expect(result.current.dimensions).toEqual({
        width: 456,
        height: 123,
      });
    });
    (gumMock?.stream.getVideoTracks()[0].getSettings as jest.Mock).mockImplementation(() => ({
      width: 222,
      height: 111,
    }));
    act(() => {
      videoRef.current?.onresize?.({} as any);
    });
    rerender();
    await waitFor(() => {
      expect(result.current.dimensions).toEqual({
        width: 222,
        height: 111,
      });
    });
    unmount();
  });
});
