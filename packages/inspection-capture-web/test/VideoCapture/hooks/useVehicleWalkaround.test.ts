import { act, renderHook } from '@testing-library/react';
import { useVehicleWalkaround } from '../../../src/VideoCapture/hooks';

jest.mock('@monkvision/common-ui-web', () => ({
  ...jest.requireActual('@monkvision/common-ui-web'),
}));

jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
}));

describe('useVehicleWalkaround hook', () => {
  it('should return 0 and empty coverage when the walkaround has not been started', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number; isRecording: boolean }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 35, isRecording: false },
      },
    );

    expect(result.current.walkaroundPosition).toEqual(0);
    expect(result.current.coveragePercentage).toEqual(0);
    rerender({ alpha: 30, isRecording: false });
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 300, isRecording: false });
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });

  it('should track position relative to starting point', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number; isRecording: boolean }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 100, isRecording: false },
      },
    );

    expect(result.current.startWalkaround).toBeInstanceOf(Function);
    act(() => result.current.startWalkaround());

    expect(result.current.walkaroundPosition).toEqual(0);

    rerender({ alpha: 90, isRecording: false });
    rerender({ alpha: 85, isRecording: false });
    rerender({ alpha: 80, isRecording: false });
    rerender({ alpha: 75, isRecording: false });
    expect(result.current.walkaroundPosition).toBeGreaterThan(0);
    expect(result.current.walkaroundPosition).toBeLessThan(30);

    rerender({ alpha: 50, isRecording: false });
    rerender({ alpha: 45, isRecording: false });
    expect(result.current.walkaroundPosition).toBeGreaterThan(20);
    expect(result.current.walkaroundPosition).toBeLessThan(60);

    unmount();
  });

  it('should track coverage in both directions', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number; isRecording: boolean }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 100, isRecording: true },
      },
    );

    act(() => result.current.startWalkaround());

    const initialCoverage = result.current.coveragePercentage;
    expect(initialCoverage).toBeGreaterThan(0);

    rerender({ alpha: 95, isRecording: true });
    rerender({ alpha: 90, isRecording: true });
    rerender({ alpha: 85, isRecording: true });
    rerender({ alpha: 80, isRecording: true });
    const coverageAfterRight = result.current.coveragePercentage;
    expect(coverageAfterRight).toBeGreaterThan(initialCoverage);

    rerender({ alpha: 100, isRecording: true });
    rerender({ alpha: 105, isRecording: true });
    rerender({ alpha: 110, isRecording: true });
    rerender({ alpha: 115, isRecording: true });
    rerender({ alpha: 120, isRecording: true });
    const coverageAfterBoth = result.current.coveragePercentage;

    expect(coverageAfterBoth).toBeGreaterThan(coverageAfterRight);

    unmount();
  });

  it('should reset coverage and position on start', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number; isRecording: boolean }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 100, isRecording: true },
      },
    );

    act(() => result.current.startWalkaround());
    rerender({ alpha: 95, isRecording: true });
    rerender({ alpha: 90, isRecording: true });
    rerender({ alpha: 85, isRecording: true });
    rerender({ alpha: 80, isRecording: true });
    rerender({ alpha: 75, isRecording: true });
    rerender({ alpha: 70, isRecording: true });

    const firstCoverage = result.current.coveragePercentage;
    expect(firstCoverage).toBeGreaterThan(1.388);

    rerender({ alpha: 200, isRecording: true });
    act(() => result.current.startWalkaround());

    expect(result.current.coveragePercentage).toBeLessThan(firstCoverage);
    expect(result.current.coveragePercentage).toBeGreaterThan(0);
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });
});
