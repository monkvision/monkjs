import {
  useVideoRecording,
  UseVideoRecordingParams,
  VideoRecordingTooltip,
} from '../../../src/VideoCapture/hooks';
import { renderHook } from '@testing-library/react-hooks';
import { useInterval } from '@monkvision/common';
import { act } from '@testing-library/react';

function createProps(): UseVideoRecordingParams {
  let isRecording = false;
  return {
    get isRecording() {
      return isRecording;
    },
    setIsRecording: jest.fn((param) => {
      isRecording = typeof param === 'boolean' ? param : param(isRecording);
    }),
    walkaroundPosition: 300,
    startWalkaround: jest.fn(),
    screenshotInterval: 200,
    minRecordingDuration: 5000,
    onCaptureVideoFrame: jest.fn(),
    onRecordingComplete: jest.fn(),
  };
}

jest.useFakeTimers();

describe('useVideoRecording hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start with the proper initial state', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useVideoRecording, { initialProps });

    expect(result.current).toEqual(
      expect.objectContaining({
        isRecordingPaused: false,
        recordingDurationMs: 0,
        onClickRecordVideo: expect.any(Function),
        onDiscardDialogKeepRecording: expect.any(Function),
        onDiscardDialogDiscardVideo: expect.any(Function),
        isDiscardDialogDisplayed: false,
        pauseRecording: expect.any(Function),
        resumeRecording: expect.any(Function),
      }),
    );

    unmount();
  });

  it('should not be taking screenshots when the video is not recording', () => {
    const initialProps = createProps();
    const { unmount } = renderHook(useVideoRecording, { initialProps });

    expect(useInterval).toHaveBeenCalledWith(expect.anything(), null);

    unmount();
  });

  it('should start taking screenshots when the user clicks on the recording button', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    expect(initialProps.isRecording).toBe(true);
    expect(result.current.isRecordingPaused).toBe(false);
    expect(useInterval).toHaveBeenCalledWith(expect.anything(), initialProps.screenshotInterval);
    const callback = (useInterval as jest.Mock).mock.calls[
      (useInterval as jest.Mock).mock.calls.length - 1
    ][0];
    expect(initialProps.onCaptureVideoFrame).not.toHaveBeenCalled();
    callback();
    expect(initialProps.onCaptureVideoFrame).toHaveBeenCalled();

    unmount();
  });

  it('should keep track of the recording length', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    expect(result.current.recordingDurationMs).toEqual(0);
    const time = 2547;
    jest.advanceTimersByTime(time);
    rerender();
    expect(result.current.recordingDurationMs).toEqual(time);

    unmount();
  });

  it('should display the discard warning and pause the recording when stopping the video too soon based on the recording time', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    jest.advanceTimersByTime(initialProps.minRecordingDuration - 1);
    rerender();
    (useInterval as jest.Mock).mockClear();
    expect(result.current.isDiscardDialogDisplayed).toBe(false);
    act(() => {
      result.current.onClickRecordVideo();
    });
    expect(result.current.isDiscardDialogDisplayed).toBe(true);
    expect(initialProps.isRecording).toBe(false);
    expect(result.current.isRecordingPaused).toBe(true);
    expect(useInterval).toHaveBeenCalledWith(expect.anything(), null);
    expect(result.current.recordingDurationMs).toEqual(initialProps.minRecordingDuration - 1);
    jest.advanceTimersByTime(4500);
    rerender();
    expect(result.current.recordingDurationMs).toEqual(initialProps.minRecordingDuration - 1);

    unmount();
  });

  it('should display the discard warning and pause the recording when stopping the video too soon based on the walkaround position', () => {
    const initialProps = createProps();
    initialProps.walkaroundPosition = 269;
    const { result, rerender, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    jest.advanceTimersByTime(initialProps.minRecordingDuration + 1);
    rerender();
    (useInterval as jest.Mock).mockClear();
    expect(result.current.isDiscardDialogDisplayed).toBe(false);
    act(() => {
      result.current.onClickRecordVideo();
    });
    expect(result.current.isDiscardDialogDisplayed).toBe(true);
    expect(initialProps.isRecording).toBe(false);
    expect(result.current.isRecordingPaused).toBe(true);
    expect(useInterval).toHaveBeenCalledWith(expect.anything(), null);
    expect(result.current.recordingDurationMs).toEqual(initialProps.minRecordingDuration + 1);
    jest.advanceTimersByTime(4500);
    rerender();
    expect(result.current.recordingDurationMs).toEqual(initialProps.minRecordingDuration + 1);

    unmount();
  });

  it('should resume the recording when the user presses on the keep recording button', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    jest.advanceTimersByTime(initialProps.minRecordingDuration - 1);
    rerender();
    act(() => {
      result.current.onClickRecordVideo();
    });
    rerender();
    (useInterval as jest.Mock).mockClear();
    act(() => {
      result.current.onDiscardDialogKeepRecording();
    });
    expect(result.current.isDiscardDialogDisplayed).toBe(false);
    expect(initialProps.isRecording).toBe(true);
    expect(result.current.isRecordingPaused).toBe(false);
    expect(useInterval).toHaveBeenCalledWith(expect.anything(), initialProps.screenshotInterval);
    expect(result.current.recordingDurationMs).toEqual(initialProps.minRecordingDuration - 1);
    const time = 4500;
    jest.advanceTimersByTime(time);
    rerender();
    expect(result.current.recordingDurationMs).toEqual(
      time + initialProps.minRecordingDuration - 1,
    );

    unmount();
  });

  it('should stop the recording when the user presses on the discard video button', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    jest.advanceTimersByTime(initialProps.minRecordingDuration - 1);
    rerender();
    act(() => {
      result.current.onClickRecordVideo();
    });
    rerender();
    (useInterval as jest.Mock).mockClear();
    act(() => {
      result.current.onDiscardDialogDiscardVideo();
    });
    expect(result.current.isDiscardDialogDisplayed).toBe(false);
    expect(useInterval).toHaveBeenCalledWith(expect.anything(), null);
    expect(result.current.recordingDurationMs).toEqual(0);
    expect(initialProps.isRecording).toBe(false);
    expect(result.current.isRecordingPaused).toBe(false);
    jest.advanceTimersByTime(4500);
    rerender();
    expect(result.current.recordingDurationMs).toEqual(0);

    unmount();
  });

  it('should return the start tooltip initially', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useVideoRecording, { initialProps });

    expect(result.current.tooltip).toEqual(VideoRecordingTooltip.START);

    unmount();
  });

  it('should dismiss the initial tooltip once the user starts recording the video', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    expect(result.current.tooltip).toBeNull();

    unmount();
  });

  it('should show the end tooltip once the compass reaches the end', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(useVideoRecording, { initialProps });

    act(() => {
      result.current.onClickRecordVideo();
    });
    rerender({ ...initialProps, walkaroundPosition: 316 });
    expect(result.current.tooltip).toEqual(VideoRecordingTooltip.END);

    unmount();
  });
});
