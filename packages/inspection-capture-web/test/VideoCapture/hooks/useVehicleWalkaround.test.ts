import { act, renderHook } from '@testing-library/react';
import { useVehicleWalkaround } from '../../../src/VideoCapture/hooks';

describe('useVehicleWalkaround hook', () => {
  it('should return 0 and empty coverage when the walkaround has not been started', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 35 },
      },
    );

    expect(result.current.walkaroundPosition).toEqual(0);
    expect(result.current.coveredSegments).toEqual([]);
    expect(result.current.coveragePercentage).toEqual(0);
    rerender({ alpha: 30 });
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 300 });
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });

  it('should track position relative to starting point', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 100 },
      },
    );

    expect(result.current.startWalkaround).toBeInstanceOf(Function);
    act(() => result.current.startWalkaround());

    expect(result.current.walkaroundPosition).toEqual(0);

    rerender({ alpha: 90 });
    expect(result.current.walkaroundPosition).toBeGreaterThan(0);
    expect(result.current.walkaroundPosition).toBeLessThan(15);

    rerender({ alpha: 50 });
    expect(result.current.walkaroundPosition).toBeGreaterThan(10);
    expect(result.current.walkaroundPosition).toBeLessThan(25);

    unmount();
  });

  it('should track coverage in both directions', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 100 },
      },
    );

    act(() => result.current.startWalkaround());

    rerender({ alpha: 80 });
    const coverageAfterRight = result.current.coveragePercentage;
    expect(coverageAfterRight).toBeGreaterThan(0);

    rerender({ alpha: 100 });
    rerender({ alpha: 120 });
    const coverageAfterBoth = result.current.coveragePercentage;

    expect(coverageAfterBoth).toBeGreaterThan(coverageAfterRight);

    unmount();
  });

  it('should reset coverage and position on start', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 100 },
      },
    );

    act(() => result.current.startWalkaround());
    rerender({ alpha: 80 });

    const firstCoverage = result.current.coveragePercentage;
    expect(firstCoverage).toBeGreaterThan(0);

    rerender({ alpha: 200 });
    act(() => result.current.startWalkaround());

    expect(result.current.coveragePercentage).toBeLessThan(firstCoverage);
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });

  it('should have coverage segments that match the covered areas', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 100 },
      },
    );

    act(() => result.current.startWalkaround());

    rerender({ alpha: 50 });

    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    result.current.coveredSegments.forEach((segment) => {
      expect(segment).toHaveProperty('start');
      expect(segment).toHaveProperty('end');
      expect(segment.start).toBeGreaterThanOrEqual(0);
      expect(segment.end).toBeLessThanOrEqual(360);
    });

    unmount();
  });
});
