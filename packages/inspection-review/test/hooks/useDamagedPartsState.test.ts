import { renderHook } from '@testing-library/react';
import { MonkState, MonkStateWithDispatch } from '@monkvision/common';
import { useMonkState } from '@monkvision/common';
import {
  DamageType,
  MonkEntityType,
  Part,
  Damage,
  PricingV2,
  PricingV2RelatedItemType,
  VehiclePart,
} from '@monkvision/types';
import useDamagedPartsState, { type DamagedPartsProps } from '../../src/hooks/useDamagedPartsState';
import {
  getChildPartsForAggregation,
  isChildPartForAggregation,
} from '../../src/utils/partAggregation.utils';

jest.mock('@monkvision/common', () => ({
  useMonkState: jest.fn(),
}));

jest.mock('../../src/utils/partAggregation.utils', () => ({
  getChildPartsForAggregation: jest.fn(),
  isChildPartForAggregation: jest.fn(),
}));

const mockUseMonkState = useMonkState as jest.MockedFunction<typeof useMonkState>;
const mockGetChildPartsForAggregation = getChildPartsForAggregation as jest.MockedFunction<
  typeof getChildPartsForAggregation
>;
const mockIsChildPartForAggregation = isChildPartForAggregation as jest.MockedFunction<
  typeof isChildPartForAggregation
>;

const MOCK_INSPECTION_ID = 'test-inspection-id';
const OTHER_INSPECTION_ID = 'other-inspection-id';

const MOCK_PART_HOOD: Part = {
  id: 'part-hood',
  entityType: MonkEntityType.PART,
  type: VehiclePart.HOOD,
  inspectionId: MOCK_INSPECTION_ID,
  damages: ['damage-hood-1', 'damage-hood-2'],
  relatedImages: [],
};

const MOCK_PART_DOOR: Part = {
  id: 'part-door',
  entityType: MonkEntityType.PART,
  type: VehiclePart.DOOR_FRONT_LEFT,
  inspectionId: MOCK_INSPECTION_ID,
  damages: [],
  relatedImages: [],
};

const MOCK_PART_WHEEL: Part = {
  id: 'part-wheel',
  entityType: MonkEntityType.PART,
  type: VehiclePart.WHEEL_FRONT_LEFT,
  inspectionId: MOCK_INSPECTION_ID,
  damages: ['damage-wheel-1'],
  relatedImages: [],
};

const MOCK_PART_RIM: Part = {
  id: 'part-rim',
  entityType: MonkEntityType.PART,
  type: VehiclePart.RIM_FRONT_LEFT,
  inspectionId: MOCK_INSPECTION_ID,
  damages: ['damage-rim-1'],
  relatedImages: [],
};

const MOCK_PART_HUBCAP: Part = {
  id: 'part-hubcap',
  entityType: MonkEntityType.PART,
  type: VehiclePart.HUBCAP_FRONT_LEFT,
  inspectionId: MOCK_INSPECTION_ID,
  damages: [],
  relatedImages: [],
};

const MOCK_PART_NO_DAMAGE: Part = {
  id: 'part-no-damage',
  entityType: MonkEntityType.PART,
  type: VehiclePart.BUMPER_FRONT,
  inspectionId: MOCK_INSPECTION_ID,
  damages: [],
  relatedImages: [],
};

const MOCK_PART_OTHER_INSPECTION: Part = {
  id: 'part-other',
  entityType: MonkEntityType.PART,
  type: VehiclePart.BUMPER_BACK,
  inspectionId: OTHER_INSPECTION_ID,
  damages: [],
  relatedImages: [],
};

const MOCK_DAMAGE_HOOD_SCRATCH: Damage = {
  id: MOCK_PART_HOOD.damages[0],
  entityType: MonkEntityType.DAMAGE,
  inspectionId: MOCK_INSPECTION_ID,
  type: DamageType.SCRATCH,
  parts: [MOCK_PART_HOOD.id],
  relatedImages: [],
};

const MOCK_DAMAGE_HOOD_DENT: Damage = {
  id: MOCK_PART_HOOD.damages[1],
  entityType: MonkEntityType.DAMAGE,
  inspectionId: MOCK_INSPECTION_ID,
  type: DamageType.DENT,
  parts: [MOCK_PART_HOOD.id],
  relatedImages: [],
};

const MOCK_DAMAGE_WHEEL_DENT: Damage = {
  id: MOCK_PART_WHEEL.damages[0],
  entityType: MonkEntityType.DAMAGE,
  inspectionId: MOCK_INSPECTION_ID,
  type: DamageType.DENT,
  parts: [MOCK_PART_WHEEL.id],
  relatedImages: [],
};

const MOCK_DAMAGE_RIM_SCRATCH: Damage = {
  id: MOCK_PART_RIM.damages[0],
  entityType: MonkEntityType.DAMAGE,
  inspectionId: MOCK_INSPECTION_ID,
  type: DamageType.SCRATCH,
  parts: [MOCK_PART_RIM.id],
  relatedImages: [],
};

const MOCK_PRICING_HOOD: PricingV2 = {
  id: 'pricing-hood',
  entityType: MonkEntityType.PRICING,
  inspectionId: MOCK_INSPECTION_ID,
  relatedItemId: MOCK_PART_HOOD.id,
  relatedItemType: PricingV2RelatedItemType.PART,
  pricing: 500,
};

const MOCK_PRICING_WHEEL: PricingV2 = {
  id: 'pricing-wheel',
  entityType: MonkEntityType.PRICING,
  inspectionId: MOCK_INSPECTION_ID,
  relatedItemId: MOCK_PART_WHEEL.id,
  relatedItemType: PricingV2RelatedItemType.PART,
  pricing: 200,
};

const MOCK_PRICING_RIM: PricingV2 = {
  id: 'pricing-rim',
  entityType: MonkEntityType.PRICING,
  inspectionId: MOCK_INSPECTION_ID,
  relatedItemId: MOCK_PART_RIM.id,
  relatedItemType: PricingV2RelatedItemType.PART,
  pricing: 150,
};

const MOCK_PRICING_HUBCAP: PricingV2 = {
  id: 'pricing-hubcap',
  entityType: MonkEntityType.PRICING,
  inspectionId: MOCK_INSPECTION_ID,
  relatedItemId: MOCK_PART_HUBCAP.id,
  relatedItemType: PricingV2RelatedItemType.PART,
  pricing: 50,
};

const createMockState = (overrides?: Partial<MonkState>): MonkState =>
  ({
    inspections: [MOCK_INSPECTION_ID],
    parts: [
      MOCK_PART_HOOD,
      MOCK_PART_DOOR,
      MOCK_PART_WHEEL,
      MOCK_PART_RIM,
      MOCK_PART_HUBCAP,
      MOCK_PART_NO_DAMAGE,
      MOCK_PART_OTHER_INSPECTION,
    ],
    damages: [
      MOCK_DAMAGE_HOOD_SCRATCH,
      MOCK_DAMAGE_HOOD_DENT,
      MOCK_DAMAGE_WHEEL_DENT,
      MOCK_DAMAGE_RIM_SCRATCH,
    ],
    pricings: [MOCK_PRICING_HOOD, MOCK_PRICING_WHEEL, MOCK_PRICING_RIM, MOCK_PRICING_HUBCAP],
    ...overrides,
  } as MonkState);

const createMockProps = (overrides?: Partial<DamagedPartsProps>): DamagedPartsProps => ({
  inspectionId: MOCK_INSPECTION_ID,
  ...overrides,
});

describe('useDamagedPartsState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsChildPartForAggregation.mockReturnValue(false);
    mockGetChildPartsForAggregation.mockReturnValue([]);
  });

  describe('basic functionality', () => {
    it('should return damaged parts details for the given inspection', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const damagedPartsCount = mockState.parts.filter(
        (part) => part.inspectionId === MOCK_INSPECTION_ID,
      ).length;
      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      expect(result.current.damagedPartsDetails).toBeDefined();
      expect(result.current.damagedPartsDetails).toHaveLength(damagedPartsCount);
      expect(Array.isArray(result.current.damagedPartsDetails)).toBe(true);
    });

    it('should filter parts by inspectionId', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const partTypes = result.current.damagedPartsDetails.map((p) => p.part);
      expect(partTypes).toContain(MOCK_PART_HOOD.type);
      expect(partTypes).toContain(MOCK_PART_DOOR.type);
      expect(partTypes).toContain(MOCK_PART_WHEEL.type);

      expect(result.current.damagedPartsDetails.length).toBeGreaterThan(0);

      const allPartsHaveCorrectInspectionId = result.current.damagedPartsDetails.every((part) => {
        const originalPart = mockState.parts.find((p) => p.type === part.part);
        return originalPart?.inspectionId === MOCK_INSPECTION_ID;
      });
      expect(allPartsHaveCorrectInspectionId).toBe(true);
    });

    it('should exclude child parts from aggregation', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      mockIsChildPartForAggregation.mockImplementation((part: VehiclePart) => {
        return part === VehiclePart.RIM_FRONT_LEFT || part === VehiclePart.HUBCAP_FRONT_LEFT;
      });

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const partTypes = result.current.damagedPartsDetails.map((p) => p.part);
      expect(partTypes).not.toContain(MOCK_PART_RIM.type);
      expect(partTypes).not.toContain(MOCK_PART_HUBCAP.type);
      expect(mockIsChildPartForAggregation).toHaveBeenCalledWith(MOCK_PART_RIM.type);
      expect(mockIsChildPartForAggregation).toHaveBeenCalledWith(MOCK_PART_HUBCAP.type);
    });
  });

  describe('damage aggregation', () => {
    it('should aggregate damage types for a part', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const hoodPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_HOOD.type,
      );

      expect(hoodPart?.damageTypes).toContain(MOCK_DAMAGE_HOOD_SCRATCH.type);
      expect(hoodPart?.damageTypes).toContain(MOCK_DAMAGE_HOOD_DENT.type);
      expect(hoodPart?.isDamaged).toBe(true);
    });

    it('should mark parts without damages as not damaged', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const noDamagePart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_NO_DAMAGE.type,
      );

      expect(noDamagePart?.damageTypes).toEqual([]);
      expect(noDamagePart?.isDamaged).toBe(false);
    });

    it('should include pricing for damaged parts', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const hoodPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_HOOD.type,
      );
      const wheelPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_WHEEL.type,
      );

      expect(hoodPart?.pricing).toBe(MOCK_PRICING_HOOD.pricing);
      expect(wheelPart?.pricing).toBe(MOCK_PRICING_WHEEL.pricing);
    });

    it('should handle parts without pricing', () => {
      const mockState = createMockState({
        pricings: [MOCK_PRICING_HOOD],
      });
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const noDamagePart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_NO_DAMAGE.type,
      );

      expect(noDamagePart?.pricing).toBeUndefined();
    });
  });

  describe('child parts aggregation', () => {
    it('should call getChildPartsForAggregation for each parent part', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      renderHook(() => useDamagedPartsState(props));

      expect(mockGetChildPartsForAggregation).toHaveBeenCalledWith(MOCK_PART_HOOD.type);
      expect(mockGetChildPartsForAggregation).toHaveBeenCalledWith(MOCK_PART_DOOR.type);
    });

    it('should aggregate damage types from child parts', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);
      const mockedGetChildPartsForAggregationResult = [
        VehiclePart.RIM_FRONT_LEFT,
        VehiclePart.HUBCAP_FRONT_LEFT,
      ];
      mockGetChildPartsForAggregation.mockImplementation((part: VehiclePart) => {
        if (part === VehiclePart.WHEEL_FRONT_LEFT) {
          return mockedGetChildPartsForAggregationResult;
        }
        return [];
      });

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const wheelPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_WHEEL.type,
      );

      expect(wheelPart?.damageTypes).toContain(MOCK_DAMAGE_WHEEL_DENT.type);
      expect(wheelPart?.damageTypes).toContain(MOCK_DAMAGE_RIM_SCRATCH.type);
      expect(wheelPart?.damageTypes).toHaveLength(mockedGetChildPartsForAggregationResult.length);
    });

    it('should not duplicate damage types when aggregating', () => {
      const mockState = createMockState({
        damages: [
          MOCK_DAMAGE_WHEEL_DENT,
          {
            ...MOCK_DAMAGE_RIM_SCRATCH,
            type: DamageType.DENT,
          },
        ],
      });
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      mockGetChildPartsForAggregation.mockImplementation((part: VehiclePart) => {
        if (part === VehiclePart.WHEEL_FRONT_LEFT) {
          return [VehiclePart.RIM_FRONT_LEFT];
        }
        return [];
      });

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const wheelPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_WHEEL.type,
      );

      expect(wheelPart?.damageTypes).toEqual([DamageType.DENT]);
      expect(wheelPart?.damageTypes).toHaveLength(1);
    });

    it('should aggregate pricing from child parts', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      mockGetChildPartsForAggregation.mockImplementation((part: VehiclePart) => {
        if (part === VehiclePart.WHEEL_FRONT_LEFT) {
          return [VehiclePart.RIM_FRONT_LEFT, VehiclePart.HUBCAP_FRONT_LEFT];
        }
        return [];
      });

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const wheelPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_WHEEL.type,
      );

      const expectedPricing =
        (MOCK_PRICING_WHEEL.pricing as number) +
        (MOCK_PRICING_RIM.pricing as number) +
        (MOCK_PRICING_HUBCAP.pricing as number);
      expect(wheelPart?.pricing).toBe(expectedPricing);
    });

    it('should handle parent without pricing but child with pricing', () => {
      const mockState = createMockState({
        pricings: [MOCK_PRICING_RIM, MOCK_PRICING_HUBCAP],
      });
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      mockGetChildPartsForAggregation.mockImplementation((part: VehiclePart) => {
        if (part === VehiclePart.WHEEL_FRONT_LEFT) {
          return [VehiclePart.RIM_FRONT_LEFT, VehiclePart.HUBCAP_FRONT_LEFT];
        }
        return [];
      });

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const wheelPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_WHEEL.type,
      );

      const expectedPricing =
        (MOCK_PRICING_RIM.pricing as number) + (MOCK_PRICING_HUBCAP.pricing as number);
      expect(wheelPart?.pricing).toBe(expectedPricing);
    });

    it('should skip child parts that do not exist in inspection', () => {
      const mockState = createMockState({
        parts: [MOCK_PART_WHEEL],
      });
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      mockGetChildPartsForAggregation.mockImplementation((part: VehiclePart) => {
        if (part === VehiclePart.WHEEL_FRONT_LEFT) {
          return [VehiclePart.RIM_FRONT_LEFT, VehiclePart.HUBCAP_FRONT_LEFT];
        }
        return [];
      });

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const wheelPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_WHEEL.type,
      );

      expect(wheelPart?.damageTypes).toContain(MOCK_DAMAGE_WHEEL_DENT.type);
      expect(wheelPart?.damageTypes).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty state', () => {
      const mockState = createMockState({
        parts: [],
        damages: [],
        pricings: [],
      });
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      expect(result.current.damagedPartsDetails).toEqual([]);
    });

    it('should handle inspection with no parts', () => {
      const mockState = createMockState();
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps({ inspectionId: 'non-existent-id' });
      const { result } = renderHook(() => useDamagedPartsState(props));

      expect(result.current.damagedPartsDetails).toEqual([]);
    });

    it('should handle parts with invalid damage references', () => {
      const mockState = createMockState({
        damages: [],
      });
      mockUseMonkState.mockReturnValue({ state: mockState } as MonkStateWithDispatch);

      const props = createMockProps();
      const { result } = renderHook(() => useDamagedPartsState(props));

      const hoodPart = result.current.damagedPartsDetails.find(
        (p) => p.part === MOCK_PART_HOOD.type,
      );

      expect(hoodPart?.damageTypes).toEqual([]);
      expect(hoodPart?.isDamaged).toBe(false);
    });
  });
});
