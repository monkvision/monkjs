import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { NetworkQuality, useNetworkStatus } from '../../src';

function setNavigatorOnline(value: boolean): void {
  Object.defineProperty(window.navigator, 'onLine', { value, configurable: true });
}

function goOffline(): void {
  setNavigatorOnline(false);
  window.dispatchEvent(new Event('offline'));
}

function goOnline(): void {
  setNavigatorOnline(true);
  window.dispatchEvent(new Event('online'));
}

describe('useNetworkStatus hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setNavigatorOnline(true);
  });

  afterEach(() => {
    jest.useRealTimers();
    Object.defineProperty(window.navigator, 'connection', { value: undefined, configurable: true });
  });

  it('should be online with a good quality by default', () => {
    const { result, unmount } = renderHook(useNetworkStatus);
    expect(result.current.isOnline).toBe(true);
    expect(result.current.quality).toBe(NetworkQuality.GOOD);
    unmount();
  });

  it('should be offline at mount if the browser is offline', () => {
    setNavigatorOnline(false);
    const { result, unmount } = renderHook(useNetworkStatus);
    expect(result.current.isOnline).toBe(false);
    expect(result.current.quality).toBe(NetworkQuality.OFFLINE);
    unmount();
  });

  it('should go offline immediately and only recover after the stable delay', () => {
    const { result, unmount } = renderHook(useNetworkStatus, {
      initialProps: { recoveryStableMs: 3000 },
    });
    act(() => goOffline());
    expect(result.current.isOnline).toBe(false);
    expect(result.current.quality).toBe(NetworkQuality.OFFLINE);
    act(() => goOnline());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.quality).toBe(NetworkQuality.OFFLINE);
    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(result.current.quality).toBe(NetworkQuality.OFFLINE);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.quality).toBe(NetworkQuality.GOOD);
    unmount();
  });

  it('should not recover if the connection flaps before the stable delay', () => {
    const { result, unmount } = renderHook(useNetworkStatus, {
      initialProps: { recoveryStableMs: 3000 },
    });
    act(() => goOffline());
    act(() => goOnline());
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => goOffline());
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.quality).toBe(NetworkQuality.OFFLINE);
    unmount();
  });

  it('should become poor after consecutive failed samples', () => {
    const { result, unmount } = renderHook(useNetworkStatus, {
      initialProps: { poorFailureStreak: 2 },
    });
    act(() => result.current.reportSample({ failed: true }));
    expect(result.current.quality).toBe(NetworkQuality.GOOD);
    act(() => result.current.reportSample({ failed: true }));
    expect(result.current.quality).toBe(NetworkQuality.POOR);
    unmount();
  });

  it('should become poor when the upload throughput is too low', () => {
    const { result, unmount } = renderHook(useNetworkStatus, {
      initialProps: { poorThroughputKbps: 150 },
    });
    // 100 KB in 10s = 80 kbps
    act(() => result.current.reportSample({ bytes: 100000, durationMs: 10000 }));
    expect(result.current.quality).toBe(NetworkQuality.POOR);
    unmount();
  });

  it('should recover from poor after a fast successful sample and the stable delay', () => {
    const { result, unmount } = renderHook(useNetworkStatus, {
      initialProps: { poorFailureStreak: 1, recoveryStableMs: 1000 },
    });
    act(() => result.current.reportSample({ failed: true }));
    expect(result.current.quality).toBe(NetworkQuality.POOR);
    // 1 MB in 1s = 8000 kbps
    act(() => result.current.reportSample({ bytes: 1000000, durationMs: 1000 }));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.quality).toBe(NetworkQuality.GOOD);
    unmount();
  });

  it('should automatically lift the poor status after the poor recovery delay', () => {
    const { result, unmount } = renderHook(useNetworkStatus, {
      initialProps: { poorFailureStreak: 1, recoveryStableMs: 0, poorRecoveryDelayMs: 10000 },
    });
    act(() => result.current.reportSample({ failed: true }));
    expect(result.current.quality).toBe(NetworkQuality.POOR);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.quality).toBe(NetworkQuality.GOOD);
    // The delay is doubled the second time
    act(() => result.current.reportSample({ failed: true }));
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect(result.current.quality).toBe(NetworkQuality.POOR);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.quality).toBe(NetworkQuality.GOOD);
    unmount();
  });

  it('should reset the poor status when the page becomes visible again', () => {
    const { result, unmount } = renderHook(useNetworkStatus, {
      initialProps: { poorFailureStreak: 1, recoveryStableMs: 0 },
    });
    act(() => result.current.reportSample({ failed: true }));
    expect(result.current.quality).toBe(NetworkQuality.POOR);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.quality).toBe(NetworkQuality.GOOD);
    unmount();
  });

  it('should use the Network Information API as a hint when available', () => {
    const connection = Object.assign(new EventTarget(), { effectiveType: '4g', rtt: 50 });
    Object.defineProperty(window.navigator, 'connection', {
      value: connection,
      configurable: true,
    });
    const { result, unmount } = renderHook(useNetworkStatus);
    expect(result.current.effectiveType).toBe('4g');
    expect(result.current.rttMs).toBe(50);
    act(() => {
      connection.effectiveType = '2g';
      connection.rtt = 1800;
      connection.dispatchEvent(new Event('change'));
    });
    expect(result.current.effectiveType).toBe('2g');
    expect(result.current.rttMs).toBe(1800);
    expect(result.current.quality).toBe(NetworkQuality.POOR);
    unmount();
  });

  it('should remove the event listeners on unmount', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(useNetworkStatus);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    removeSpy.mockRestore();
  });
});
