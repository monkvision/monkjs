import { PromiseHandlers } from '@monkvision/types';
import { renderHook } from '@testing-library/react';
import { flushPromises } from '@monkvision/test-utils';
import { useAsyncInterval } from '../../src';

interface UseIntervalProps<T> {
  callback: () => Promise<T>;
  delay: number | null;
  handlers?: Partial<PromiseHandlers<T>>;
}

function renderUseAsyncInterval<T>(initialProps: UseIntervalProps<T>) {
  return renderHook((p: UseIntervalProps<T>) => useAsyncInterval(p.callback, p.delay, p.handlers), {
    initialProps,
  });
}

describe('useInterval hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should not call the callback if the delay is null', () => {
    const callback = jest.fn(() => Promise.resolve());
    const delay = null;
    const { unmount } = renderUseAsyncInterval({ callback, delay });

    jest.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();

    unmount();
  });

  it('should not call the callback if the delay is less than zero', () => {
    const callback = jest.fn(() => Promise.resolve());
    const delay = -1;
    const { unmount } = renderUseAsyncInterval({ callback, delay });

    jest.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();

    unmount();
  });

  it('should call the callback every delay milliseconds', async () => {
    const callback = jest.fn(() => Promise.resolve());
    const delay = 1000;
    const { unmount } = renderUseAsyncInterval({ callback, delay });

    jest.advanceTimersByTime(delay);
    await flushPromises();
    jest.advanceTimersByTime(delay);
    await flushPromises();
    jest.advanceTimersByTime(delay);
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(3);

    unmount();
  });

  it('should stop calling the callback after the component unmounts', () => {
    const callback = jest.fn(() => Promise.resolve());
    const delay = 300;
    const { unmount } = renderUseAsyncInterval({ callback, delay });

    jest.advanceTimersByTime(1000);
    unmount();
    callback.mockRestore();
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not restart the timer if a new handler is passed', () => {
    const callback1 = jest.fn(() => Promise.resolve());
    const callback2 = jest.fn(() => Promise.resolve());
    const delay = 1000;
    const { rerender, unmount } = renderUseAsyncInterval({ callback: callback1, delay });

    jest.advanceTimersByTime(delay / 2);
    rerender({ callback: callback2, delay });
    jest.advanceTimersByTime(delay / 2);
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('should not call the callback again while the promise is still running', async () => {
    const callback = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        }),
    );
    const delay = 1000;
    const { unmount } = renderUseAsyncInterval({ callback, delay });

    jest.advanceTimersByTime(1000);
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(2000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('should call promise handlers after each callback result', async () => {
    const onResolve = jest.fn();
    const onReject = jest.fn();
    const onComplete = jest.fn();
    let id = 0;
    const callback = jest.fn(() => {
      id += 1;
      if (id === 1) {
        return Promise.resolve(id);
      }
      return Promise.reject(id);
    });
    const delay = 1000;
    const { unmount } = renderUseAsyncInterval({
      callback,
      delay,
      handlers: { onResolve, onReject, onComplete },
    });

    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(onResolve).toHaveBeenCalledTimes(1);
    expect(onResolve).toHaveBeenCalledWith(1);
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledWith(2);
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('should not perform state updates on unmounted components', async () => {
    const onComplete = jest.fn();
    const callback = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        }),
    );
    const delay = 1000;
    const { unmount } = renderUseAsyncInterval({ callback, delay, handlers: { onComplete } });

    jest.advanceTimersByTime(1000);
    await flushPromises();
    unmount();

    jest.advanceTimersByTime(5000);
    await flushPromises();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();

    unmount();
  });
});
