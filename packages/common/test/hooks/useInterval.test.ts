import { useInterval } from '../../src';
import { renderHook } from '@testing-library/react-hooks';

interface UseIntervalProps {
  callback: () => void;
  delay: number | null;
}

function renderUseInterval(initialProps: UseIntervalProps) {
  return renderHook((p: UseIntervalProps) => useInterval(p.callback, p.delay), { initialProps });
}

describe('useInterval hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should not call the callback if the delay is null', () => {
    const callback = jest.fn();
    const delay = null;
    const { unmount } = renderUseInterval({ callback, delay });

    jest.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();

    unmount();
  });

  it('should not call the callback if the delay is less than zero', () => {
    const callback = jest.fn();
    const delay = -1;
    const { unmount } = renderUseInterval({ callback, delay });

    jest.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();

    unmount();
  });

  it('should call the callback every delay milliseconds', () => {
    const expectedCalls = 4;
    const callback = jest.fn();
    const delay = 1000;
    const { unmount } = renderUseInterval({ callback, delay });

    jest.advanceTimersByTime(expectedCalls * delay);
    expect(callback).toHaveBeenCalledTimes(expectedCalls);

    unmount();
  });

  it('should stop calling the callback after the component unmounts', () => {
    const callback = jest.fn();
    const delay = 300;
    const { unmount } = renderUseInterval({ callback, delay });

    jest.advanceTimersByTime(1000);
    unmount();
    callback.mockRestore();
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not restart the timer if a new handler is passed', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const delay = 1000;
    const { rerender, unmount } = renderUseInterval({ callback: callback1, delay });

    jest.advanceTimersByTime(delay / 2);
    rerender({ callback: callback2, delay });
    jest.advanceTimersByTime(delay / 2);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);

    unmount();
  });
});
