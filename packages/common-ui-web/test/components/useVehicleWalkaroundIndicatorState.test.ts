import { renderHook } from '@testing-library/react';
import { useVehicleWalkaroundIndicatorState } from '../../src';

describe('useVehicleWalkaroundIndicatorState hook', () => {
  it('should return empty coverage when not tracking', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isTracking?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 35, isTracking: false },
      },
    );

    expect(result.current.coveredSegments).toEqual([]);
    rerender({ walkaroundPosition: 30, isTracking: false });
    expect(result.current.coveredSegments).toEqual([]);
    rerender({ walkaroundPosition: 300, isTracking: false });
    expect(result.current.coveredSegments).toEqual([]);

    unmount();
  });

  it('should track segments when isTracking is true', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isTracking?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isTracking: false },
      },
    );

    expect(result.current.coveredSegments).toEqual([]);

    rerender({ walkaroundPosition: 0, isTracking: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 10, isTracking: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 50, isTracking: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    unmount();
  });

  it('should track coverage in both directions', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isTracking?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isTracking: true },
      },
    );

    const initialSegments = result.current.coveredSegments.length;
    expect(initialSegments).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 5, isTracking: true });
    rerender({ walkaroundPosition: 10, isTracking: true });
    rerender({ walkaroundPosition: 15, isTracking: true });
    rerender({ walkaroundPosition: 20, isTracking: true });
    const segmentsAfterRight = result.current.coveredSegments.length;
    expect(segmentsAfterRight).toBeGreaterThanOrEqual(initialSegments);

    rerender({ walkaroundPosition: 0, isTracking: true });
    rerender({ walkaroundPosition: 355, isTracking: true });
    rerender({ walkaroundPosition: 350, isTracking: true });
    rerender({ walkaroundPosition: 345, isTracking: true });
    rerender({ walkaroundPosition: 340, isTracking: true });
    const segmentsAfterBoth = result.current.coveredSegments.length;

    expect(segmentsAfterBoth).toBeGreaterThanOrEqual(segmentsAfterRight);

    unmount();
  });

  it('should reset coverage when isTracking toggles from true to false to true', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isTracking?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isTracking: true },
      },
    );

    rerender({ walkaroundPosition: 10, isTracking: true });
    rerender({ walkaroundPosition: 20, isTracking: true });
    rerender({ walkaroundPosition: 30, isTracking: true });
    rerender({ walkaroundPosition: 40, isTracking: true });
    rerender({ walkaroundPosition: 50, isTracking: true });
    rerender({ walkaroundPosition: 60, isTracking: true });

    const firstSegments = result.current.coveredSegments.length;
    expect(firstSegments).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 200, isTracking: false });

    expect(result.current.coveredSegments).toEqual([]);

    rerender({ walkaroundPosition: 200, isTracking: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);
    expect(result.current.coveredSegments.length).toBeLessThan(firstSegments);

    unmount();
  });

  it('should have coverage segments that match the covered areas', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isTracking?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isTracking: true },
      },
    );

    rerender({ walkaroundPosition: 50, isTracking: true });

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
