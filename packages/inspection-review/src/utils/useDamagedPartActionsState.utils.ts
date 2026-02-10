import {
  MonkAction,
  MonkActionType,
  MonkState,
  MonkUpdatedOnePricingAction,
} from '@monkvision/common';
import {
  MonkEntityType,
  Part,
  PricingV2,
  PricingV2RelatedItemType,
  VehiclePart,
} from '@monkvision/types';
import { useMonkApi } from '@monkvision/network';
import { DamagedPartDetails } from '../types';

export function handleDeleteDamagesAndPricing(
  monkApi: ReturnType<typeof useMonkApi>,
  inspectionId: string,
  partToDelete?: Part,
  pricingToDelete?: PricingV2,
): void {
  partToDelete?.damages.forEach((damageId) => {
    monkApi.deleteDamage({ id: inspectionId, damageId });
  });
  if (pricingToDelete) {
    monkApi.deletePricing({ id: inspectionId, pricingId: pricingToDelete?.id });
  }
}

export function handleUpdatePricing(
  monkApi: ReturnType<typeof useMonkApi>,
  inspectionId: string,
  dispatch: (value: MonkAction) => void,
  pricing: number,
  pricingToModify: PricingV2,
): void {
  monkApi.updatePricing({
    id: inspectionId,
    pricingId: pricingToModify.id,
    price: pricing,
  });

  const action: MonkUpdatedOnePricingAction = {
    type: MonkActionType.UPDATED_ONE_PRICING,
    payload: {
      pricing: {
        entityType: MonkEntityType.PRICING,
        id: pricingToModify.id,
        inspectionId,
        relatedItemType: PricingV2RelatedItemType.PART,
        pricing,
      },
    },
  };
  dispatch(action);
}

export function handleCreatePricing(
  monkApi: ReturnType<typeof useMonkApi>,
  inspectionId: string,
  damagedPart: DamagedPartDetails,
  partToUpdate?: Part,
): void {
  if (damagedPart.pricing === undefined) {
    return;
  }
  monkApi
    .createPricing({
      id: inspectionId,
      pricing: {
        pricing: damagedPart.pricing,
        type: PricingV2RelatedItemType.PART,
        vehiclePart: damagedPart.part,
      },
    })
    .then(() => {
      if (!partToUpdate) {
        monkApi.getInspection({ id: inspectionId, light: false });
      }
    })
    .catch((e) => {
      throw new Error(e);
    });
}

export function handleDeleteOldAndCreateNewDamages(
  monkApi: ReturnType<typeof useMonkApi>,
  state: MonkState,
  inspectionId: string,
  damagedPart: DamagedPartDetails,
  partToUpdate?: Part,
): void {
  const damagesFilteredByPartSelected = state.damages
    .filter((value) => value.inspectionId === inspectionId)
    .filter((damage) => partToUpdate?.damages.includes(damage.id));

  damagesFilteredByPartSelected.forEach((damage) => {
    if (!damagedPart.damageTypes.includes(damage.type)) {
      monkApi.deleteDamage({ id: inspectionId, damageId: damage.id });
    }
  });

  damagedPart.damageTypes.forEach((damage) => {
    if (!damagesFilteredByPartSelected.map((value) => value.type).includes(damage)) {
      monkApi.createDamage({ id: inspectionId, damageType: damage, vehiclePart: damagedPart.part });
    }
  });
}

/**
 * Helper function to delete damages and pricing for all child parts of a parent part.
 * All damages and pricing associated with the child parts will be assigned to the parent part.
 */
export function handleChildPartDamagesAndPricingDeletion(
  monkApi: ReturnType<typeof useMonkApi>,
  state: MonkState,
  inspectionId: string,
  childParts: VehiclePart[],
): void {
  childParts.forEach((childPart) => {
    const childPartToUpdate = state.parts
      .filter((value) => value.inspectionId === inspectionId)
      .find((part) => part.type === childPart);

    const childPricingToModify = state.pricings
      .filter((value) => value.inspectionId === inspectionId)
      .find((pricing) => pricing.relatedItemId === childPartToUpdate?.id);

    if (childPartToUpdate) {
      handleDeleteDamagesAndPricing(monkApi, inspectionId, childPartToUpdate, childPricingToModify);
    }
  });
}
