import { act, renderHook } from '@testing-library/react';
import { useVehicleWalkaround } from '../../../src/VideoCapture/hooks';

jest.mock('@monkvision/common-ui-web', () => ({
  ...jest.requireActual('@monkvision/common-ui-web'),
}));

describe('useVehicleWalkaround hook', () => {
  it('should return 0 and empty coverage when the walkaround has not been started', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { alpha: number }) => useVehicleWalkaround(props),
      {
        initialProps: { alpha: 35 },
      },
    );

    expect(result.current.walkaroundPosition).toEqual(0);
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
    rerender({ alpha: 85 });
    rerender({ alpha: 80 });
    rerender({ alpha: 75 });
    expect(result.current.walkaroundPosition).toBeGreaterThan(0);
    expect(result.current.walkaroundPosition).toBeLessThan(30);

    rerender({ alpha: 50 });
    rerender({ alpha: 45 });
    expect(result.current.walkaroundPosition).toBeGreaterThan(20);
    expect(result.current.walkaroundPosition).toBeLessThan(60);

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

    const initialCoverage = result.current.coveragePercentage;
    expect(initialCoverage).toBeGreaterThan(0);

    rerender({ alpha: 95 });
    rerender({ alpha: 90 });
    rerender({ alpha: 85 });
    rerender({ alpha: 80 });
    const coverageAfterRight = result.current.coveragePercentage;
    expect(coverageAfterRight).toBeGreaterThan(initialCoverage);

    rerender({ alpha: 100 });
    rerender({ alpha: 105 });
    rerender({ alpha: 110 });
    rerender({ alpha: 115 });
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
    rerender({ alpha: 95 });
    rerender({ alpha: 90 });
    rerender({ alpha: 85 });
    rerender({ alpha: 80 });
    rerender({ alpha: 75 });
    rerender({ alpha: 70 });

    const firstCoverage = result.current.coveragePercentage;
    expect(firstCoverage).toBeGreaterThan(1.388);

    rerender({ alpha: 200 });
    act(() => result.current.startWalkaround());

    expect(result.current.coveragePercentage).toBeLessThan(firstCoverage);
    expect(result.current.coveragePercentage).toBeGreaterThan(0);
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });
});
