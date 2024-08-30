import { renderHook } from '@testing-library/react-hooks';
import { PhotoCaptureMode, useAddDamageMode } from '../../../src/PhotoCapture/hooks';
import { act } from '@testing-library/react';
import { MonkAppState, useMonkAppState } from '@monkvision/common';
import { AddDamage, VehiclePart } from '@monkvision/types';

describe('useAddDamageMode hook', () => {
  beforeEach(() => {
    (useMonkAppState as jest.MockedFunction<typeof useMonkAppState>).mockReturnValue({
      config: { addDamage: AddDamage.TWO_SHOT },
    } as ReturnType<MonkAppState extends (o: { requireInspection: true }) => infer R ? (args: any) => R : never>);
  });
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

  it('should switch to ADD_DAMAGE_PART_SELECT', () => {
    (useMonkAppState as jest.MockedFunction<typeof useMonkAppState>).mockReturnValue({
      config: { addDamage: AddDamage.PART_SELECT },
    } as ReturnType<MonkAppState extends (o: { requireInspection: true }) => infer R ? (args: any) => R : never>);
    const { result } = renderHook(useAddDamageMode);
    act(() => result.current.handleAddDamage());
    expect(result.current.mode).toEqual(PhotoCaptureMode.ADD_DAMAGE_PART_SELECT);
  });

  it('should throw error if add damage is disabled', () => {
    (useMonkAppState as jest.MockedFunction<typeof useMonkAppState>).mockReturnValue({
      config: { addDamage: AddDamage.DISABLED },
    } as ReturnType<MonkAppState extends (o: { requireInspection: true }) => infer R ? (args: any) => R : never>);
    const { result } = renderHook(useAddDamageMode);
    expect(() => act(() => result.current.handleAddDamage())).toThrowError(
      'Add Damage feature is disabled',
    );
  });

  it('should throw error if add damage type is unknown', () => {
    (useMonkAppState as jest.MockedFunction<typeof useMonkAppState>).mockReturnValue({
      config: { addDamage: 'unknown' as AddDamage },
    } as ReturnType<MonkAppState extends (o: { requireInspection: true }) => infer R ? (args: any) => R : never>);
    const { result } = renderHook(useAddDamageMode);
    expect(() => act(() => result.current.handleAddDamage())).toThrowError(
      'Unknown Add Damage type',
    );
  });

  it('should set the vehicle parts', () => {
    const { result } = renderHook(useAddDamageMode);
    act(() => result.current.handleAddParts([VehiclePart.BUMPER_BACK, VehiclePart.BUMPER_FRONT]));
    expect(result.current.vehicleParts).toEqual([
      VehiclePart.BUMPER_BACK,
      VehiclePart.BUMPER_FRONT,
    ]);
  });
});
