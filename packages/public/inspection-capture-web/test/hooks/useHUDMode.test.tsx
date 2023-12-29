import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { useHUDMode } from '../../src/hooks';
import { HUDMode } from '../../src/PhotoCaptureHUD/hook';

describe('useHUDMode hook', () => {
  it('should return as SightSelected default state', () => {
    const { result, unmount } = renderHook(() => useHUDMode());

    expect(result.current.mode).toEqual(HUDMode.DEFAULT);
    unmount();
  });

  it('should return a empty array of sights as SightTaken default state', () => {
    const { result, unmount } = renderHook(() => useHUDMode());

    expect(typeof result.current.handleAddDamage).toEqual('function');
    unmount();
  });
  it('should update mode with handleAddDamage', () => {
    const { result } = renderHook(() => useHUDMode());

    act(() => {
      result.current.handleAddDamage(HUDMode.ADD_DAMAGE);
    });

    expect(result.current.mode).toBe(HUDMode.ADD_DAMAGE);
  });
});
