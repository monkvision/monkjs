import { renderHook } from '@testing-library/react-hooks';
import { PhotoCaptureMode, useAddDamageMode } from '../../../src/PhotoCapture/hooks';
import { act } from '@testing-library/react';

describe('useAddDamageMode hook', () => {
  it('should be in the SIGHT mode by default', () => {
    const { result, unmount } = renderHook(useAddDamageMode);
    expect(result.current.mode).toEqual(PhotoCaptureMode.SIGHT);
    unmount();
  });

  it('should switch to ADD_DAMAGE_1ST_SHOT', () => {
    const { result, unmount } = renderHook(useAddDamageMode);
    act(() => result.current.handleAddDamage());
    expect(result.current.mode).toEqual(PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT);
    unmount();
  });

  it('should switch to ADD_DAMAGE_2ND_SHOT', () => {
    const { result, unmount } = renderHook(useAddDamageMode);
    act(() => result.current.handleAddDamage());
    act(() => result.current.updatePhotoCaptureModeAfterPictureTaken());
    expect(result.current.mode).toEqual(PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT);
    unmount();
  });

  it('should go back to the SIGHT mode', () => {
    const { result, unmount } = renderHook(useAddDamageMode);
    act(() => result.current.handleAddDamage());
    act(() => result.current.updatePhotoCaptureModeAfterPictureTaken());
    act(() => result.current.updatePhotoCaptureModeAfterPictureTaken());
    expect(result.current.mode).toEqual(PhotoCaptureMode.SIGHT);
    unmount();
  });

  it('should allow to cancel add damage at any time', () => {
    const { result, unmount } = renderHook(useAddDamageMode);
    act(() => result.current.handleAddDamage());
    act(() => result.current.handleCancelAddDamage());
    expect(result.current.mode).toEqual(PhotoCaptureMode.SIGHT);
    act(() => result.current.handleAddDamage());
    act(() => result.current.updatePhotoCaptureModeAfterPictureTaken());
    act(() => result.current.handleCancelAddDamage());
    expect(result.current.mode).toEqual(PhotoCaptureMode.SIGHT);
    unmount();
  });
});
