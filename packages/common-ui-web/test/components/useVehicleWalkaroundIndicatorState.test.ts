jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
}));
import { renderHook } from '@testing-library/react';
import { useVehicleWalkaroundIndicatorState } from '../../src';
import { WalkaroundTrackingState } from '../../src/components/VehicleWalkaroundIndicator/VehicleWalkaroundIndicator.types';

describe('useVehicleWalkaroundIndicatorState hook', () => {
  it('should return empty coverage when not tracking', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; trackingState?: WalkaroundTrackingState }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 35, trackingState: WalkaroundTrackingState.Off },
      },
    );

    expect(result.current.coveredSegments).toEqual([]);
    rerender({ walkaroundPosition: 30, trackingState: WalkaroundTrackingState.Off });
    expect(result.current.coveredSegments).toEqual([]);
    rerender({ walkaroundPosition: 300, trackingState: WalkaroundTrackingState.Off });
    expect(result.current.coveredSegments).toEqual([]);

    unmount();
  });

  it('should track segments when isRecording is true', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; trackingState?: WalkaroundTrackingState }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, trackingState: WalkaroundTrackingState.Off },
      },
    );

    expect(result.current.coveredSegments).toEqual([]);

    rerender({ walkaroundPosition: 0, trackingState: WalkaroundTrackingState.Active });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 10, trackingState: WalkaroundTrackingState.Active });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 50, trackingState: WalkaroundTrackingState.Active });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    unmount();
  });

  it('should track coverage in both directions', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; trackingState?: WalkaroundTrackingState }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, trackingState: WalkaroundTrackingState.Active },
      },
    );

    const initialSegments = result.current.coveredSegments.length;
    expect(initialSegments).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 5, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 10, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 15, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 20, trackingState: WalkaroundTrackingState.Active });
    const segmentsAfterRight = result.current.coveredSegments.length;
    expect(segmentsAfterRight).toBeGreaterThanOrEqual(initialSegments);

    rerender({ walkaroundPosition: 0, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 355, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 350, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 345, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 340, trackingState: WalkaroundTrackingState.Active });
    const segmentsAfterBoth = result.current.coveredSegments.length;

    expect(segmentsAfterBoth).toBeGreaterThanOrEqual(segmentsAfterRight);

    unmount();
  });

  it('should reset coverage when isRecording toggles from true to false to true', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; trackingState?: WalkaroundTrackingState }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, trackingState: WalkaroundTrackingState.Active },
      },
    );

    rerender({ walkaroundPosition: 10, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 20, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 30, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 40, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 50, trackingState: WalkaroundTrackingState.Active });
    rerender({ walkaroundPosition: 60, trackingState: WalkaroundTrackingState.Active });

    const firstSegments = result.current.coveredSegments.length;
    expect(firstSegments).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 200, trackingState: WalkaroundTrackingState.Off });

    expect(result.current.coveredSegments).toEqual([]);

    rerender({ walkaroundPosition: 200, trackingState: WalkaroundTrackingState.Active });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);
    expect(result.current.coveredSegments.length).toBeLessThan(firstSegments);

    unmount();
  });

  it('should have coverage segments that match the covered areas', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; trackingState?: WalkaroundTrackingState }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, trackingState: WalkaroundTrackingState.Active },
      },
    );

    rerender({ walkaroundPosition: 50, trackingState: WalkaroundTrackingState.Active });

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
