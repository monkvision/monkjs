jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
}));
import { renderHook } from '@testing-library/react';
import { useVehicleWalkaroundIndicatorState } from '../../src';

describe('useVehicleWalkaroundIndicatorState hook', () => {
  it('should return empty coverage when not tracking', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isRecording?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 35, isRecording: false },
      },
    );

    expect(result.current.coveredSegments).toEqual([]);
    rerender({ walkaroundPosition: 30, isRecording: false });
    expect(result.current.coveredSegments).toEqual([]);
    rerender({ walkaroundPosition: 300, isRecording: false });
    expect(result.current.coveredSegments).toEqual([]);

    unmount();
  });

  it('should track segments when isRecording is true', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isRecording?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isRecording: false },
      },
    );

    expect(result.current.coveredSegments).toEqual([]);

    rerender({ walkaroundPosition: 0, isRecording: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 10, isRecording: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 50, isRecording: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);

    unmount();
  });

  it('should track coverage in both directions', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isRecording?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isRecording: true },
      },
    );

    const initialSegments = result.current.coveredSegments.length;
    expect(initialSegments).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 5, isRecording: true });
    rerender({ walkaroundPosition: 10, isRecording: true });
    rerender({ walkaroundPosition: 15, isRecording: true });
    rerender({ walkaroundPosition: 20, isRecording: true });
    const segmentsAfterRight = result.current.coveredSegments.length;
    expect(segmentsAfterRight).toBeGreaterThanOrEqual(initialSegments);

    rerender({ walkaroundPosition: 0, isRecording: true });
    rerender({ walkaroundPosition: 355, isRecording: true });
    rerender({ walkaroundPosition: 350, isRecording: true });
    rerender({ walkaroundPosition: 345, isRecording: true });
    rerender({ walkaroundPosition: 340, isRecording: true });
    const segmentsAfterBoth = result.current.coveredSegments.length;

    expect(segmentsAfterBoth).toBeGreaterThanOrEqual(segmentsAfterRight);

    unmount();
  });

  it('should reset coverage when isRecording toggles from true to false to true', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isRecording?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isRecording: true },
      },
    );

    rerender({ walkaroundPosition: 10, isRecording: true });
    rerender({ walkaroundPosition: 20, isRecording: true });
    rerender({ walkaroundPosition: 30, isRecording: true });
    rerender({ walkaroundPosition: 40, isRecording: true });
    rerender({ walkaroundPosition: 50, isRecording: true });
    rerender({ walkaroundPosition: 60, isRecording: true });

    const firstSegments = result.current.coveredSegments.length;
    expect(firstSegments).toBeGreaterThan(0);

    rerender({ walkaroundPosition: 200, isRecording: false });

    expect(result.current.coveredSegments).toEqual([]);

    rerender({ walkaroundPosition: 200, isRecording: true });
    expect(result.current.coveredSegments.length).toBeGreaterThan(0);
    expect(result.current.coveredSegments.length).toBeLessThan(firstSegments);

    unmount();
  });

  it('should have coverage segments that match the covered areas', () => {
    const { result, rerender, unmount } = renderHook(
      (props: { walkaroundPosition: number; isRecording?: boolean }) =>
        useVehicleWalkaroundIndicatorState(props),
      {
        initialProps: { walkaroundPosition: 0, isRecording: true },
      },
    );

    rerender({ walkaroundPosition: 50, isRecording: true });

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
