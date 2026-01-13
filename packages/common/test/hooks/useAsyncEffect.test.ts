import { renderHook, waitFor } from '@testing-library/react';
import { useAsyncEffect } from '../../src';
import { createFakePromise } from '@monkvision/test-utils';

describe('useAsyncEffect hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the effect on the first render', () => {
    const effect = jest.fn(() => Promise.resolve());
    const { unmount } = renderHook((props) => useAsyncEffect(props.effect, props.deps), {
      initialProps: { effect, deps: [] },
    });
    expect(effect).toHaveBeenCalled();
    unmount();
  });

  it('should call the effect again only if the dependencies change', () => {
    const effect = jest.fn(() => Promise.resolve());
    const dep = 1;
    const { unmount, rerender } = renderHook((props) => useAsyncEffect(props.effect, props.deps), {
      initialProps: { effect, deps: [dep] },
    });
    expect(effect).toHaveBeenCalledTimes(1);
    rerender({ effect, deps: [dep] });
    expect(effect).toHaveBeenCalledTimes(1);
    rerender({ effect, deps: [dep + 1] });
    expect(effect).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('should call the onResolve handler when provided', async () => {
    const result = 35;
    const effect = jest.fn(() => Promise.resolve(result));
    const onResolve = jest.fn();
    const { unmount } = renderHook(
      (props) => useAsyncEffect(props.effect, props.deps, props.handlers),
      {
        initialProps: { effect, deps: [], handlers: { onResolve } },
      },
    );
    await waitFor(() => {
      expect(onResolve).toHaveBeenCalledWith(result);
    });
    unmount();
  });

  it('should call the onReject handler when provided', async () => {
    const err = 22;
    const effect = jest.fn(() => Promise.reject(err));
    const onReject = jest.fn();
    const { unmount } = renderHook(
      (props) => useAsyncEffect(props.effect, props.deps, props.handlers),
      {
        initialProps: { effect, deps: [], handlers: { onReject } },
      },
    );
    await waitFor(() => {
      expect(onReject).toHaveBeenCalledWith(err);
    });
    unmount();
  });

  it('should call the onComplete handler after the promise resolves', async () => {
    const effect = jest.fn(() => Promise.resolve());
    const onComplete = jest.fn();
    const { unmount } = renderHook(
      (props) => useAsyncEffect(props.effect, props.deps, props.handlers),
      {
        initialProps: { effect, deps: [], handlers: { onComplete } },
      },
    );
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
    unmount();
  });

  it('should call the onComplete handler after the promise rejects', async () => {
    const effect = jest.fn(() => Promise.reject());
    const onComplete = jest.fn();
    const { unmount } = renderHook(
      (props) => useAsyncEffect(props.effect, props.deps, props.handlers),
      {
        initialProps: { effect, deps: [], handlers: { onComplete } },
      },
    );
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
    unmount();
  });

  it('should not call handlers if the promise completes after the unmount', async () => {
    const fakePromise = createFakePromise();
    const effect = jest.fn(() => fakePromise);
    const onResolve = jest.fn();
    const onReject = jest.fn();
    const onComplete = jest.fn();
    const { unmount } = renderHook(
      (props) => useAsyncEffect(props.effect, props.deps, props.handlers),
      {
        initialProps: { effect, deps: [], handlers: { onResolve, onReject, onComplete } },
      },
    );
    unmount();
    fakePromise.resolve({});
    expect(onResolve).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should not call handlers if the promise rejects after the unmount', async () => {
    const fakePromise = createFakePromise();
    const effect = jest.fn(() => fakePromise);
    const onResolve = jest.fn();
    const onReject = jest.fn();
    const onComplete = jest.fn();
    const { unmount } = renderHook(
      (props) => useAsyncEffect(props.effect, props.deps, props.handlers),
      {
        initialProps: { effect, deps: [], handlers: { onResolve, onReject, onComplete } },
      },
    );
    unmount();
    fakePromise.reject({});
    expect(onResolve).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
