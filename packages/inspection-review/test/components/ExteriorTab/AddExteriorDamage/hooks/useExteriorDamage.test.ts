import { act, renderHook } from '@testing-library/react';
import { DamageType, VehiclePart } from '@monkvision/types';
import {
  useExteriorDamage,
  UseExteriorDamageProps,
} from '../../../../../src/components/ExteriorTab/AddExteriorDamage/hooks/useExteriorDamage';
import { DamagedPartDetails } from '../../../../../src/types';

jest.mock('@monkvision/common', () => ({
  useObjectMemo: jest.fn((value) => value),
}));

const MOCK_PART: DamagedPartDetails = {
  part: VehiclePart.BUMPER_FRONT,
  isDamaged: true,
  damageTypes: [DamageType.DENT],
  pricing: 120,
};

const createMockProps = (
  overrides?: Partial<DamagedPartDetails> | null,
): UseExteriorDamageProps => ({
  selectedExteriorPart: overrides
    ? ({
        ...MOCK_PART,
        ...overrides,
      } as DamagedPartDetails)
    : MOCK_PART,
  onDone: jest.fn(),
});

describe('useExteriorDamage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes state from selected exterior part with damages', () => {
    const props = createMockProps();
    const { result } = renderHook(() => useExteriorDamage(props));

    expect(result.current.hasDamage).toBe(true);
    expect(result.current.damageTypes).toEqual([DamageType.DENT]);
    expect(result.current.pricing).toBe(120);
    expect(result.current.detailedPart).toEqual(MOCK_PART);
  });

  it('initializes default state when no selected part', () => {
    const props = createMockProps(null as unknown as DamagedPartDetails);
    props.selectedExteriorPart = null;

    const { result } = renderHook(() => useExteriorDamage(props));

    expect(result.current.hasDamage).toBe(false);
    expect(result.current.damageTypes).toEqual([]);
    expect(result.current.pricing).toBe(0);
    expect(result.current.detailedPart).toBeNull();
    expect(result.current.isDoneDisabled).toBe(false);
  });

  it('marks done disabled when hasDamage is true and no damage types', () => {
    const props = createMockProps({ damageTypes: [] });
    const { result } = renderHook(() => useExteriorDamage(props));

    act(() => {
      result.current.setHasDamage(true);
    });

    expect(result.current.isDoneDisabled).toBe(true);
  });

  it('toggles damage types on click', () => {
    const props = createMockProps({ damageTypes: [] });
    const { result } = renderHook(() => useExteriorDamage(props));

    act(() => {
      result.current.onDamageClicked(DamageType.SCRATCH);
    });

    expect(result.current.damageTypes).toEqual([DamageType.SCRATCH]);

    act(() => {
      result.current.onDamageClicked(DamageType.SCRATCH);
    });

    expect(result.current.damageTypes).toEqual([]);
  });

  it('updates pricing with numeric input', () => {
    const props = createMockProps({ pricing: 0 });
    const { result } = renderHook(() => useExteriorDamage(props));

    act(() => {
      result.current.handlePricingChange({ target: { value: '150' } } as any);
    });

    expect(result.current.pricing).toBe(150);
  });

  it('sets pricing to undefined on empty input', () => {
    const props = createMockProps({ pricing: 200 });
    const { result } = renderHook(() => useExteriorDamage(props));

    act(() => {
      result.current.handlePricingChange({ target: { value: '' } } as any);
    });

    expect(result.current.pricing).toBeUndefined();
  });

  it('ignores non-numeric pricing input', () => {
    const props = createMockProps({ pricing: 75 });
    const { result } = renderHook(() => useExteriorDamage(props));

    act(() => {
      result.current.handlePricingChange({ target: { value: 'abc' } } as any);
    });

    expect(result.current.pricing).toBe(75);
  });

  it('does not call onDone when no selected exterior part', () => {
    const props = createMockProps(null as unknown as DamagedPartDetails);
    props.selectedExteriorPart = null;

    const { result } = renderHook(() => useExteriorDamage(props));

    act(() => {
      result.current.handleDoneClick();
    });

    expect(props.onDone).not.toHaveBeenCalled();
  });

  it('calls onDone with current state when part is selected', () => {
    const props = createMockProps({ damageTypes: [DamageType.SCRATCH], pricing: 300 });
    const { result } = renderHook(() => useExteriorDamage(props));

    act(() => {
      result.current.setHasDamage(true);
    });

    act(() => {
      result.current.onDamageClicked(DamageType.DENT);
    });

    act(() => {
      result.current.handlePricingChange({ target: { value: '450' } } as any);
    });

    act(() => {
      result.current.handleDoneClick();
    });

    expect(props.onDone).toHaveBeenCalledWith({
      part: props.selectedExteriorPart?.part,
      damageTypes: [DamageType.SCRATCH, DamageType.DENT],
      pricing: 450,
      isDamaged: true,
    });
  });
});
