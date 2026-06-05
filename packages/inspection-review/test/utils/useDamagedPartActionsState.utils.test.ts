import { MonkActionType, MonkState } from '@monkvision/common';
import { useMonkApi } from '@monkvision/network';
import {
  DamageType,
  MonkEntityType,
  Part,
  PricingV2,
  PricingV2RelatedItemType,
  VehiclePart,
} from '@monkvision/types';
import type { DamagedPartDetails } from '../../src';
import {
  handleDeleteDamagesAndPricing,
  handleUpdatePricing,
  handleCreatePricing,
  handleDeleteOldAndCreateNewDamages,
  handleChildPartDamagesAndPricingDeletion,
} from '../../src/utils/useDamagedPartActionsState.utils';

type UseMonkApiType = ReturnType<typeof useMonkApi>;
const mockInspectionId = 'test-inspection-id';
const mockMonkApi: Partial<UseMonkApiType> = {
  deleteDamage: jest.fn(),
  deletePricing: jest.fn(),
  updatePricing: jest.fn(),
  createPricing: jest.fn().mockResolvedValue({ id: 'new-pricing-id' }),
  createDamage: jest.fn(),
  getInspection: jest.fn(),
};
const mockDispatch = jest.fn();
const mockPart: Part = {
  id: 'part-1',
  entityType: MonkEntityType.PART,
  type: VehiclePart.HOOD,
  inspectionId: mockInspectionId,
  damages: ['damage-1', 'damage-2', 'damage-3'],
  relatedImages: [],
};
const mockPricing: PricingV2 = {
  id: 'pricing-1',
  entityType: MonkEntityType.PRICING,
  inspectionId: mockInspectionId,
  relatedItemType: PricingV2RelatedItemType.PART,
};
const mockDamagedPart: DamagedPartDetails = {
  part: VehiclePart.HOOD,
  isDamaged: true,
  pricing: 300,
  damageTypes: [DamageType.SCRATCH],
};

describe('useDamagedPartActionsState.utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleDeleteDamagesAndPricing', () => {
    it('should delete all damages from part', () => {
      handleDeleteDamagesAndPricing(mockMonkApi as any, mockInspectionId, mockPart, undefined);

      expect(mockMonkApi.deleteDamage).toHaveBeenCalledTimes(3);
      for (const damageId of mockPart.damages) {
        expect(mockMonkApi.deleteDamage).toHaveBeenCalledWith({
          id: mockInspectionId,
          damageId,
        });
      }
    });

    it('should delete pricing if provided', () => {
      handleDeleteDamagesAndPricing(mockMonkApi as any, mockInspectionId, undefined, mockPricing);

      expect(mockMonkApi.deletePricing).toHaveBeenCalledWith({
        id: mockInspectionId,
        pricingId: mockPricing.id,
      });
    });

    it('should handle undefined part and pricing gracefully', () => {
      handleDeleteDamagesAndPricing(mockMonkApi as any, mockInspectionId, undefined, undefined);

      expect(mockMonkApi.deleteDamage).not.toHaveBeenCalled();
      expect(mockMonkApi.deletePricing).not.toHaveBeenCalled();
    });

    it('should delete both damages and pricing when both provided', () => {
      handleDeleteDamagesAndPricing(mockMonkApi as any, mockInspectionId, mockPart, mockPricing);

      for (const damageId of mockPart.damages) {
        expect(mockMonkApi.deleteDamage).toHaveBeenCalledWith({
          id: mockInspectionId,
          damageId,
        });
      }
      expect(mockMonkApi.deletePricing).toHaveBeenCalledWith({
        id: mockInspectionId,
        pricingId: mockPricing.id,
      });
    });
  });

  describe('handleUpdatePricing', () => {
    it('should call updatePricing API with correct params', () => {
      const newPricing = 500;
      handleUpdatePricing(
        mockMonkApi as any,
        mockInspectionId,
        mockDispatch,
        newPricing,
        mockPricing,
      );

      expect(mockMonkApi.updatePricing).toHaveBeenCalledWith({
        id: mockInspectionId,
        pricingId: mockPricing.id,
        price: newPricing,
      });
    });

    it('should dispatch action with updated pricing', () => {
      const updatedPricing = 750;

      handleUpdatePricing(
        mockMonkApi as any,
        mockInspectionId,
        mockDispatch,
        updatedPricing,
        mockPricing,
      );

      expect(mockDispatch).toHaveBeenCalledWith({
        type: MonkActionType.UPDATED_ONE_PRICING,
        payload: {
          pricing: {
            entityType: MonkEntityType.PRICING,
            id: mockPricing.id,
            inspectionId: mockInspectionId,
            relatedItemType: PricingV2RelatedItemType.PART,
            pricing: updatedPricing,
          },
        },
      });
    });
  });

  describe('handleCreatePricing', () => {
    it('should create pricing and call getInspection when no part exists', async () => {
      handleCreatePricing(
        mockMonkApi as UseMonkApiType,
        mockInspectionId,
        mockDamagedPart,
        undefined,
      );

      expect(mockMonkApi.createPricing).toHaveBeenCalledWith({
        id: mockInspectionId,
        pricing: {
          pricing: mockDamagedPart.pricing,
          type: PricingV2RelatedItemType.PART,
          vehiclePart: mockDamagedPart.part,
        },
      });

      await new Promise(process.nextTick);
      expect(mockMonkApi.getInspection).toHaveBeenCalledWith({
        id: mockInspectionId,
        light: false,
      });
    });

    it('should create pricing but not call getInspection when part exists', async () => {
      handleCreatePricing(
        mockMonkApi as UseMonkApiType,
        mockInspectionId,
        mockDamagedPart,
        mockPart,
      );

      await Promise.resolve();

      expect(mockMonkApi.createPricing).toHaveBeenCalledWith({
        id: mockInspectionId,
        pricing: {
          pricing: mockDamagedPart.pricing,
          type: PricingV2RelatedItemType.PART,
          vehiclePart: mockDamagedPart.part,
        },
      });

      await new Promise(process.nextTick);
      expect(mockMonkApi.getInspection).not.toHaveBeenCalled();
    });

    it('should not create pricing if pricing is undefined', () => {
      const damagedPartWithoutPricing: DamagedPartDetails = {
        ...mockDamagedPart,
        pricing: undefined,
      };

      handleCreatePricing(
        mockMonkApi as any,
        mockInspectionId,
        damagedPartWithoutPricing,
        undefined,
      );

      expect(mockMonkApi.createPricing).not.toHaveBeenCalled();
    });
  });

  describe('handleDeleteOldAndCreateNewDamages', () => {
    it('should delete old damages if not existing in new damages', () => {
      const state: MonkState = {
        damages: [
          {
            id: mockPart.damages[0],
            entityType: MonkEntityType.DAMAGE,
            inspectionId: mockInspectionId,
            type: DamageType.SCRATCH,
            parts: [],
          },
          {
            id: mockPart.damages[1],
            entityType: MonkEntityType.DAMAGE,
            inspectionId: mockInspectionId,
            type: DamageType.DENT,
            parts: [],
          },
        ],
      } as unknown as MonkState;
      const damagedPart: DamagedPartDetails = {
        ...mockDamagedPart,
        damageTypes: [DamageType.SCRATCH],
      };

      handleDeleteOldAndCreateNewDamages(
        mockMonkApi as UseMonkApiType,
        state,
        mockInspectionId,
        damagedPart,
        mockPart,
      );

      expect(mockMonkApi.deleteDamage).toHaveBeenCalledWith({
        id: mockInspectionId,
        damageId: mockPart.damages[1],
      });
      expect(mockMonkApi.deleteDamage).toHaveBeenCalledTimes(1);
    });

    it('should create new damages if not existing in old damages', () => {
      const state: MonkState = {
        damages: [
          {
            id: mockPart.damages[0],
            entityType: MonkEntityType.DAMAGE,
            inspectionId: mockInspectionId,
            type: DamageType.SCRATCH,
            parts: [],
          },
        ],
      } as unknown as MonkState;
      const damagedPart: DamagedPartDetails = {
        ...mockDamagedPart,
        damageTypes: [DamageType.SCRATCH, DamageType.DENT, DamageType.BODY_CRACK],
      };

      handleDeleteOldAndCreateNewDamages(
        mockMonkApi as UseMonkApiType,
        state,
        mockInspectionId,
        damagedPart,
        mockPart,
      );

      expect(mockMonkApi.createDamage).toHaveBeenCalledWith({
        id: mockInspectionId,
        damageType: DamageType.DENT,
        vehiclePart: VehiclePart.HOOD,
      });
      expect(mockMonkApi.createDamage).toHaveBeenCalledWith({
        id: mockInspectionId,
        damageType: DamageType.BODY_CRACK,
        vehiclePart: VehiclePart.HOOD,
      });
      expect(mockMonkApi.createDamage).toHaveBeenCalledTimes(2);
    });

    it('should delete existing damages', () => {
      const state: MonkState = {
        damages: [
          {
            id: mockPart.damages[0],
            entityType: MonkEntityType.DAMAGE,
            inspectionId: mockInspectionId,
            type: DamageType.SCRATCH,
            parts: [],
          },
        ],
      } as unknown as MonkState;
      const damagedPart: DamagedPartDetails = {
        ...mockDamagedPart,
        damageTypes: [],
      };

      handleDeleteOldAndCreateNewDamages(
        mockMonkApi as UseMonkApiType,
        state,
        mockInspectionId,
        damagedPart,
        mockPart,
      );

      expect(mockMonkApi.deleteDamage).toHaveBeenCalledWith({
        id: mockInspectionId,
        damageId: mockPart.damages[0],
      });
      expect(mockMonkApi.createDamage).not.toHaveBeenCalled();
    });
  });

  describe('handleChildPartDamagesAndPricingDeletion', () => {
    it('should delete damages and pricing for all child parts', () => {
      const childPart1: Part = {
        id: 'child-part-1',
        entityType: MonkEntityType.PART,
        type: VehiclePart.RIM_FRONT_LEFT,
        inspectionId: mockInspectionId,
        damages: ['damage-1'],
      } as Part;
      const childPart2: Part = {
        id: 'child-part-2',
        entityType: MonkEntityType.PART,
        type: VehiclePart.HUBCAP_FRONT_LEFT,
        inspectionId: mockInspectionId,
        damages: ['damage-2', 'damage-3'],
      } as Part;
      const pricing1: PricingV2 = {
        id: 'pricing-1',
        entityType: MonkEntityType.PRICING,
        inspectionId: mockInspectionId,
        relatedItemId: childPart1.id,
        relatedItemType: PricingV2RelatedItemType.PART,
      };

      const state: MonkState = {
        parts: [childPart1, childPart2],
        pricings: [pricing1],
      } as unknown as MonkState;

      handleChildPartDamagesAndPricingDeletion(
        mockMonkApi as UseMonkApiType,
        state,
        mockInspectionId,
        [VehiclePart.RIM_FRONT_LEFT, VehiclePart.HUBCAP_FRONT_LEFT],
      );

      expect(mockMonkApi.deleteDamage).toHaveBeenCalledWith({
        id: mockInspectionId,
        damageId: childPart1.damages[0],
      });
      expect(mockMonkApi.deleteDamage).toHaveBeenCalledWith({
        id: mockInspectionId,
        damageId: childPart2.damages[0],
      });
      expect(mockMonkApi.deleteDamage).toHaveBeenCalledWith({
        id: mockInspectionId,
        damageId: childPart2.damages[1],
      });
      expect(mockMonkApi.deletePricing).toHaveBeenCalledWith({
        id: mockInspectionId,
        pricingId: pricing1.id,
      });
    });

    it('should handle empty child parts array', () => {
      const state: MonkState = {
        parts: [],
        pricings: [],
      } as unknown as MonkState;

      handleChildPartDamagesAndPricingDeletion(
        mockMonkApi as UseMonkApiType,
        state,
        mockInspectionId,
        [],
      );

      expect(mockMonkApi.deleteDamage).not.toHaveBeenCalled();
      expect(mockMonkApi.deletePricing).not.toHaveBeenCalled();
    });

    it('should skip child parts that do not exist in state', () => {
      const state: MonkState = {
        parts: [],
        pricings: [],
      } as unknown as MonkState;

      handleChildPartDamagesAndPricingDeletion(
        mockMonkApi as UseMonkApiType,
        state,
        mockInspectionId,
        [VehiclePart.RIM_FRONT_LEFT],
      );

      expect(mockMonkApi.deleteDamage).not.toHaveBeenCalled();
      expect(mockMonkApi.deletePricing).not.toHaveBeenCalled();
    });
  });
});
