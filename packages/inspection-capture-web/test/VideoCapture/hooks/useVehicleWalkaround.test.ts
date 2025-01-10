import { act, renderHook } from '@testing-library/react-hooks';
import { useVehicleWalkaround } from '../../../src/VideoCapture/hooks';

describe('useVehicleWalkaround hook', () => {
  it('should return 0 when the walkaround has not been started', () => {
    const { result, rerender, unmount } = renderHook(useVehicleWalkaround, {
      initialProps: { alpha: 35 },
    });

    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 30 });
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 300 });
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });

  it('should start updating the position with the proper values after the walkaround has started', () => {
    const { result, rerender, unmount } = renderHook(useVehicleWalkaround, {
      initialProps: { alpha: 67 },
    });

    expect(result.current.startWalkaround).toBeInstanceOf(Function);
    act(() => result.current.startWalkaround());
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 64 });
    expect(result.current.walkaroundPosition).toEqual(3);
    rerender({ alpha: 40 });
    expect(result.current.walkaroundPosition).toEqual(27);
    rerender({ alpha: 14 });
    expect(result.current.walkaroundPosition).toEqual(53);
    rerender({ alpha: 334 });
    expect(result.current.walkaroundPosition).toEqual(93);
    rerender({ alpha: 294 });
    expect(result.current.walkaroundPosition).toEqual(133);
    rerender({ alpha: 259 });
    expect(result.current.walkaroundPosition).toEqual(168);
    rerender({ alpha: 227 });
    expect(result.current.walkaroundPosition).toEqual(200);
    rerender({ alpha: 197 });
    expect(result.current.walkaroundPosition).toEqual(230);
    rerender({ alpha: 167 });
    expect(result.current.walkaroundPosition).toEqual(260);
    rerender({ alpha: 137 });
    expect(result.current.walkaroundPosition).toEqual(290);
    rerender({ alpha: 107 });
    expect(result.current.walkaroundPosition).toEqual(320);
    rerender({ alpha: 77 });
    expect(result.current.walkaroundPosition).toEqual(350);
    rerender({ alpha: 68 });
    expect(result.current.walkaroundPosition).toEqual(359);
    rerender({ alpha: 30 });
    expect(result.current.walkaroundPosition).toEqual(359);

    unmount();
  });

  it('should return 0 if the user rotates past the next checkpoint', () => {
    const { result, rerender, unmount } = renderHook(useVehicleWalkaround, {
      initialProps: { alpha: 50 },
    });

    expect(result.current.startWalkaround).toBeInstanceOf(Function);
    act(() => result.current.startWalkaround());
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 30 });
    expect(result.current.walkaroundPosition).toEqual(20);
    rerender({ alpha: 310 });
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 60 });
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 45 });
    expect(result.current.walkaroundPosition).toEqual(5);
    rerender({ alpha: 51 });
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });

  it('should reset the position and checkpoints on start', () => {
    const { result, rerender, unmount } = renderHook(useVehicleWalkaround, {
      initialProps: { alpha: 67 },
    });

    expect(result.current.startWalkaround).toBeInstanceOf(Function);
    act(() => result.current.startWalkaround());
    expect(result.current.walkaroundPosition).toEqual(0);
    rerender({ alpha: 64 });
    expect(result.current.walkaroundPosition).toEqual(3);
    rerender({ alpha: 40 });
    expect(result.current.walkaroundPosition).toEqual(27);
    act(() => {
      result.current.startWalkaround();
    });
    rerender({ alpha: 38 });
    expect(result.current.walkaroundPosition).toEqual(2);
    rerender({ alpha: 45 });
    expect(result.current.walkaroundPosition).toEqual(0);

    unmount();
  });
});
