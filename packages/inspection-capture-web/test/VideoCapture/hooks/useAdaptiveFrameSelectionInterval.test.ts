import { act, renderHook } from '@testing-library/react';
import {
  ADAPTIVE_MAX_INTERVAL_MS,
  ADAPTIVE_MIN_INTERVAL_MS,
  UseAdaptiveFrameSelectionIntervalParams,
  useAdaptiveFrameSelectionInterval,
  VELOCITY_SAMPLING_INTERVAL_MS,
} from '../../../src/VideoCapture/hooks';

jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
}));

function createProps(
  props?: Partial<UseAdaptiveFrameSelectionIntervalParams>,
): UseAdaptiveFrameSelectionIntervalParams {
  return {
    alpha: 0,
    isRecording: true,
    ...props,
  };
}

describe('useAdaptiveFrameSelectionInterval hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should return the max interval when the alpha value does not change', () => {
    const initialProps = createProps({ alpha: 90 });
    const { result, rerender, unmount } = renderHook(
      (props: UseAdaptiveFrameSelectionIntervalParams) => useAdaptiveFrameSelectionInterval(props),
      { initialProps },
    );

    expect(result.current).toEqual(ADAPTIVE_MAX_INTERVAL_MS);

    for (let i = 0; i < 5; i += 1) {
      act(() => {
        jest.advanceTimersByTime(VELOCITY_SAMPLING_INTERVAL_MS);
      });
      rerender(initialProps);
    }

    expect(result.current).toEqual(ADAPTIVE_MAX_INTERVAL_MS);

    unmount();
  });

  it('should decrease the interval towards the min value when alpha changes quickly', () => {
    let alpha = 0;
    const { result, rerender, unmount } = renderHook(
      (props: UseAdaptiveFrameSelectionIntervalParams) => useAdaptiveFrameSelectionInterval(props),
      { initialProps: createProps({ alpha }) },
    );

    for (let i = 0; i < 10; i += 1) {
      alpha += 30;
      act(() => {
        jest.advanceTimersByTime(VELOCITY_SAMPLING_INTERVAL_MS);
      });
      rerender(createProps({ alpha }));
    }

    expect(result.current).toEqual(ADAPTIVE_MIN_INTERVAL_MS);

    unmount();
  });

  it('should not update the interval while not recording', () => {
    let alpha = 0;
    const { result, rerender, unmount } = renderHook(
      (props: UseAdaptiveFrameSelectionIntervalParams) => useAdaptiveFrameSelectionInterval(props),
      { initialProps: createProps({ alpha, isRecording: false }) },
    );

    for (let i = 0; i < 10; i += 1) {
      alpha += 30;
      act(() => {
        jest.advanceTimersByTime(VELOCITY_SAMPLING_INTERVAL_MS);
      });
      rerender(createProps({ alpha, isRecording: false }));
    }

    expect(result.current).toEqual(ADAPTIVE_MAX_INTERVAL_MS);

    unmount();
  });

  it('should reset the velocity tracking and interval when recording stops', () => {
    let alpha = 0;
    const { result, rerender, unmount } = renderHook(
      (props: UseAdaptiveFrameSelectionIntervalParams) => useAdaptiveFrameSelectionInterval(props),
      { initialProps: createProps({ alpha }) },
    );

    for (let i = 0; i < 10; i += 1) {
      alpha += 30;
      act(() => {
        jest.advanceTimersByTime(VELOCITY_SAMPLING_INTERVAL_MS);
      });
      rerender(createProps({ alpha }));
    }

    expect(result.current).toEqual(ADAPTIVE_MIN_INTERVAL_MS);

    rerender(createProps({ alpha, isRecording: false }));

    expect(result.current).toEqual(ADAPTIVE_MAX_INTERVAL_MS);

    unmount();
  });

  it('should return a value clamped between the min and max interval', () => {
    let alpha = 0;
    const { result, rerender, unmount } = renderHook(
      (props: UseAdaptiveFrameSelectionIntervalParams) => useAdaptiveFrameSelectionInterval(props),
      { initialProps: createProps({ alpha }) },
    );

    for (let i = 0; i < 20; i += 1) {
      alpha += i % 2 === 0 ? 1 : 45;
      act(() => {
        jest.advanceTimersByTime(VELOCITY_SAMPLING_INTERVAL_MS);
      });
      rerender(createProps({ alpha }));
      expect(result.current).toBeGreaterThanOrEqual(ADAPTIVE_MIN_INTERVAL_MS);
      expect(result.current).toBeLessThanOrEqual(ADAPTIVE_MAX_INTERVAL_MS);
    }

    unmount();
  });
});
