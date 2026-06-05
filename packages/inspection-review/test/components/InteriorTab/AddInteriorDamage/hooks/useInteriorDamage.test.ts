import { act, renderHook } from '@testing-library/react';
import { useInteriorDamage } from '../../../../../src/components/InteriorTab/AddInteriorDamage/hooks/useInteriorDamage';
import { InteriorDamage, SelectedInteriorDamageData } from '../../../../../src/types';

jest.mock('@monkvision/common', () => ({
  useObjectMemo: jest.fn((value) => value),
}));

const DEFAULT_DAMAGE: InteriorDamage = {
  area: '',
  damage_type: '',
  repair_cost: 0,
};

const FILLED_DAMAGE: InteriorDamage = {
  area: 'Front Seat',
  damage_type: 'Tear',
  repair_cost: 150,
};

describe('useInteriorDamage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createSelectedDamage = (
    damage: InteriorDamage = FILLED_DAMAGE,
  ): SelectedInteriorDamageData => ({
    index: 0,
    damage,
  });

  it('initializes state from selectedDamage', () => {
    const selectedDamage = createSelectedDamage();
    const onSave = jest.fn();

    const { result } = renderHook(() => useInteriorDamage({ selectedDamage, onSave }));

    expect(result.current.currentDamage).toEqual(FILLED_DAMAGE);
    expect(result.current.isDoneDisabled).toBe(false);
  });

  it('uses default damage when no selectedDamage provided', () => {
    const onSave = jest.fn();

    const { result } = renderHook(() => useInteriorDamage({ selectedDamage: null, onSave }));

    expect(result.current.currentDamage).toEqual(DEFAULT_DAMAGE);
    expect(result.current.isDoneDisabled).toBe(true);
  });

  it('updates currentDamage via handleInputChange', () => {
    const onSave = jest.fn();

    const { result } = renderHook(() => useInteriorDamage({ selectedDamage: null, onSave }));

    act(() => {
      result.current.handleInputChange({
        area: 'Rear Seat',
        damage_type: 'Scratch',
        repair_cost: 80,
      });
    });

    expect(result.current.currentDamage).toEqual({
      area: 'Rear Seat',
      damage_type: 'Scratch',
      repair_cost: 80,
    });
  });

  it('sets isDoneDisabled to false when required fields are filled', () => {
    const onSave = jest.fn();

    const { result } = renderHook(() => useInteriorDamage({ selectedDamage: null, onSave }));

    act(() => {
      result.current.handleInputChange({ area: 'Rear Seat', damage_type: 'Scratch' });
    });

    expect(result.current.isDoneDisabled).toBe(false);
  });

  it('does not call onSave when isDoneDisabled is true', () => {
    const onSave = jest.fn();

    const { result } = renderHook(() => useInteriorDamage({ selectedDamage: null, onSave }));

    act(() => {
      result.current.handleDone();
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it('calls onSave with currentDamage when enabled', () => {
    const onSave = jest.fn();

    const { result } = renderHook(() => useInteriorDamage({ selectedDamage: null, onSave }));

    act(() => {
      result.current.handleInputChange({
        area: 'Rear Seat',
        damage_type: 'Scratch',
        repair_cost: 200,
      });
    });

    act(() => {
      result.current.handleDone();
    });

    expect(onSave).toHaveBeenCalledWith({
      area: 'Rear Seat',
      damage_type: 'Scratch',
      repair_cost: 200,
    });
  });
});
