import { act, renderHook } from '@testing-library/react';
import {
  MAX_TARGET_FRAMES_COUNT,
  MIN_TARGET_FRAMES_COUNT,
  useSegmentFrameSelection,
  UseSegmentFrameSelectionParams,
} from '../../../src/VideoCapture/hooks';

const DEFAULT_TARGET_FRAMES_COUNT = 40;

function createProps(): UseSegmentFrameSelectionParams {
  return {
    targetFramesCount: DEFAULT_TARGET_FRAMES_COUNT,
    walkaroundPosition: 0,
    isRecording: true,
  };
}

describe('useSegmentFrameSelection hook', () => {
  it('should trigger a flush when the position enters a new bucket', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    const initialFlushTrigger = result.current.flushTrigger;
    expect(result.current.capturedFramesCount).toBe(1);

    const bucketSize = 360 / DEFAULT_TARGET_FRAMES_COUNT;
    rerender({ ...initialProps, walkaroundPosition: bucketSize + 1 });
    expect(result.current.flushTrigger).toBe(initialFlushTrigger + 1);
    expect(result.current.capturedFramesCount).toBe(2);

    unmount();
  });

  it('should not trigger a flush when the position stays within the same bucket', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    const initialFlushTrigger = result.current.flushTrigger;
    const bucketSize = 360 / DEFAULT_TARGET_FRAMES_COUNT;
    rerender({ ...initialProps, walkaroundPosition: bucketSize / 2 });
    expect(result.current.flushTrigger).toBe(initialFlushTrigger);
    expect(result.current.capturedFramesCount).toBe(1);

    unmount();
  });

  it('should not trigger a flush when a previously captured bucket is re-entered (pause/resume/backwards movement)', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    const bucketSize = 360 / DEFAULT_TARGET_FRAMES_COUNT;
    rerender({ ...initialProps, walkaroundPosition: bucketSize * 2 });
    const flushTriggerAfterMovingForward = result.current.flushTrigger;
    expect(result.current.capturedFramesCount).toBe(2);

    rerender({ ...initialProps, walkaroundPosition: 0 });
    expect(result.current.flushTrigger).toBe(flushTriggerAfterMovingForward);
    expect(result.current.capturedFramesCount).toBe(2);

    rerender({ ...initialProps, walkaroundPosition: bucketSize * 2 });
    expect(result.current.flushTrigger).toBe(flushTriggerAfterMovingForward);
    expect(result.current.capturedFramesCount).toBe(2);

    unmount();
  });

  it('should not track new buckets while not recording, but should preserve buckets already captured', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    const flushTriggerBeforePause = result.current.flushTrigger;
    const bucketSize = 360 / DEFAULT_TARGET_FRAMES_COUNT;
    rerender({ ...initialProps, isRecording: false, walkaroundPosition: bucketSize * 5 });
    expect(result.current.flushTrigger).toBe(flushTriggerBeforePause);
    expect(result.current.capturedFramesCount).toBe(1);

    rerender({ ...initialProps, isRecording: true, walkaroundPosition: bucketSize * 5 });
    expect(result.current.flushTrigger).toBe(flushTriggerBeforePause + 1);
    expect(result.current.capturedFramesCount).toBe(2);

    unmount();
  });

  it('should reset the captured buckets when startSegmentTracking is called, without triggering a flush', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    const bucketSize = 360 / DEFAULT_TARGET_FRAMES_COUNT;
    rerender({ ...initialProps, walkaroundPosition: bucketSize * 3 });
    expect(result.current.capturedFramesCount).toBe(2);

    rerender({ ...initialProps, walkaroundPosition: 0 });
    const flushTriggerBeforeReset = result.current.flushTrigger;
    act(() => {
      result.current.startSegmentTracking();
    });
    expect(result.current.flushTrigger).toBe(flushTriggerBeforeReset);
    expect(result.current.capturedFramesCount).toBe(1);

    rerender({ ...initialProps, walkaroundPosition: bucketSize * 3 });
    expect(result.current.capturedFramesCount).toBe(2);

    unmount();
  });

  it('should trigger exactly targetFramesCount - 1 flushes over a full walkaround', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    const initialFlushTrigger = result.current.flushTrigger;
    const bucketSize = 360 / DEFAULT_TARGET_FRAMES_COUNT;
    for (let bucket = 1; bucket < DEFAULT_TARGET_FRAMES_COUNT; bucket += 1) {
      rerender({ ...initialProps, walkaroundPosition: bucket * bucketSize + bucketSize / 2 });
    }

    expect(result.current.flushTrigger).toBe(initialFlushTrigger + DEFAULT_TARGET_FRAMES_COUNT - 1);
    expect(result.current.capturedFramesCount).toBe(DEFAULT_TARGET_FRAMES_COUNT);

    unmount();
  });

  it('should not increment flushTrigger on re-renders with unchanged props', () => {
    const initialProps = createProps();
    const { result, rerender, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    const bucketSize = 360 / DEFAULT_TARGET_FRAMES_COUNT;
    rerender({ ...initialProps, walkaroundPosition: bucketSize + 1 });
    const flushTriggerAfterNewBucket = result.current.flushTrigger;

    rerender({ ...initialProps, walkaroundPosition: bucketSize + 1 });
    rerender({ ...initialProps, walkaroundPosition: bucketSize + 1 });
    rerender({ ...initialProps, walkaroundPosition: bucketSize + 1 });

    expect(result.current.flushTrigger).toBe(flushTriggerAfterNewBucket);

    unmount();
  });

  it('should clamp targetFramesCount to MAX_TARGET_FRAMES_COUNT when too high', () => {
    const initialProps: UseSegmentFrameSelectionParams = {
      ...createProps(),
      targetFramesCount: MAX_TARGET_FRAMES_COUNT + 100,
    };
    const { result, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    expect(result.current.effectiveTargetFramesCount).toBe(MAX_TARGET_FRAMES_COUNT);

    unmount();
  });

  it('should clamp targetFramesCount to MIN_TARGET_FRAMES_COUNT when too low', () => {
    const initialProps: UseSegmentFrameSelectionParams = {
      ...createProps(),
      targetFramesCount: MIN_TARGET_FRAMES_COUNT - 10,
    };
    const { result, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    expect(result.current.effectiveTargetFramesCount).toBe(MIN_TARGET_FRAMES_COUNT);

    unmount();
  });

  it('should use the default target frames count when none is provided', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(
      (props: UseSegmentFrameSelectionParams) => useSegmentFrameSelection(props),
      { initialProps },
    );

    expect(result.current.effectiveTargetFramesCount).toBe(DEFAULT_TARGET_FRAMES_COUNT);

    unmount();
  });
});
