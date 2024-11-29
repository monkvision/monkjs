import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useDeviceOrientation } from '../../src';

function useDefaultDeviceOrientationEvent(): void {
  Object.defineProperty(global, 'DeviceOrientationEvent', {
    writable: true,
    value: {},
  });
}

function useiOSDeviceOrientationEvent(value: string): jest.Mock {
  const requestPermission = jest.fn(() => Promise.resolve(value));
  Object.defineProperty(global, 'DeviceOrientationEvent', {
    writable: true,
    value: { requestPermission },
  });
  return requestPermission;
}

describe('useDeviceOrientation hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDefaultDeviceOrientationEvent();
  });

  it('should not have permission granted at start', () => {
    const { result, unmount } = renderHook(useDeviceOrientation);

    expect(result.current.isPermissionGranted).toBe(false);

    unmount();
  });

  it('should directly resolve when calling requestCompassPermission on other devices than iOS', async () => {
    const { result, unmount } = renderHook(useDeviceOrientation);

    expect(typeof result.current.requestCompassPermission).toBe('function');
    await act(async () => {
      await result.current.requestCompassPermission();
    });
    expect(result.current.isPermissionGranted).toBe(true);

    unmount();
  });

  it('should make a call to requestPermission when calling requestCompassPermission on iOS', async () => {
    const requestPermission = useiOSDeviceOrientationEvent('granted');
    const { result, unmount } = renderHook(useDeviceOrientation);

    expect(typeof result.current.requestCompassPermission).toBe('function');
    await act(async () => {
      await result.current.requestCompassPermission();
    });
    expect(requestPermission).toHaveBeenCalled();
    expect(result.current.isPermissionGranted).toBe(true);

    unmount();
  });

  it('should reject when calling requestCompassPermission on iOS when requestPermission fails', async () => {
    const spy = jest.spyOn(window, 'addEventListener');
    const requestPermission = useiOSDeviceOrientationEvent('denied');
    const { result, unmount } = renderHook(useDeviceOrientation);

    expect(spy).not.toHaveBeenCalledWith('deviceorientation', expect.anything());
    expect(typeof result.current.requestCompassPermission).toBe('function');
    await act(async () => {
      await expect(() => result.current.requestCompassPermission()).rejects.toBeInstanceOf(Error);
    });
    expect(requestPermission).toHaveBeenCalled();
    expect(result.current.isPermissionGranted).toBe(false);
    expect(spy).not.toHaveBeenCalledWith('deviceorientation', expect.anything());

    unmount();
  });

  it('should start with an alpha value of 0', () => {
    const { result, unmount } = renderHook(useDeviceOrientation);

    expect(result.current.alpha).toBe(0);

    unmount();
  });

  it('should update the alpha value with webkitCompassHeading when available', async () => {
    const spy = jest.spyOn(window, 'addEventListener');
    const { result, unmount } = renderHook(useDeviceOrientation);

    expect(spy).not.toHaveBeenCalledWith('deviceorientation', expect.anything());
    await act(async () => {
      await result.current.requestCompassPermission();
    });
    expect(spy).toHaveBeenCalledWith('deviceorientation', expect.any(Function));
    const eventHandler = spy.mock.calls.find(([name]) => name === 'deviceorientation')?.[1] as (
      event: any,
    ) => void;
    expect(result.current.alpha).toBe(0);

    const value = 42;
    act(() => eventHandler({ webkitCompassHeading: value, alpha: 2222 }));
    expect(result.current.alpha).toEqual(value);

    unmount();
  });

  it('should update the alpha value with alpha if webkitCompassHeading is not available', async () => {
    const spy = jest.spyOn(window, 'addEventListener');
    const { result, unmount } = renderHook(useDeviceOrientation);

    expect(spy).not.toHaveBeenCalledWith('deviceorientation', expect.anything());
    await act(async () => {
      await result.current.requestCompassPermission();
    });
    expect(spy).toHaveBeenCalledWith('deviceorientation', expect.any(Function));
    const eventHandler = spy.mock.calls.find(([name]) => name === 'deviceorientation')?.[1] as (
      event: any,
    ) => void;
    expect(result.current.alpha).toBe(0);

    const value = 2223;
    act(() => eventHandler({ alpha: value }));
    expect(result.current.alpha).toEqual(value);

    unmount();
  });
});
