import { useTranslation } from 'react-i18next';
import { useMonitoring } from '@monkvision/monitoring';
import { useMonkApi } from '@monkvision/network';
import {
  LoadingState,
  MonkActionType,
  MonkUpdatedOneInspectionAdditionalDataAction,
  MonkUpdatedOnePricingAction,
  useMonkState,
} from '@monkvision/common';
import {
  AdditionalData,
  Inspection,
  MonkEntityType,
  Part,
  PricingV2,
  PricingV2RelatedItemType,
  VehiclePart,
} from '@monkvision/types';
import { DamagedPartDetails, InspectionReviewProps, InteriorDamage } from '../types';
import { getChildPartsForAggregation } from '../utils/partAggregation.utils';

/**
 * Props for the useDamageActionsState hook.
 */
export type UseDamageActionsStateProps = Pick<
  InspectionReviewProps,
  'inspectionId' | 'apiConfig'
> & {
  /**
   * The current inspection data.
   */
  inspection: Inspection | undefined;
  /**
   * Loading state handler.
   * Used to manage loading, success, and error states during async operations.
   * */
  loading: LoadingState;
};

/**
 * Hook to manage damage actions such as adding, deleting, and confirming damages and pricings.
 */
export default function useDamagedPartActionsState({
  inspectionId,
  apiConfig,
  inspection,
  loading,
}: UseDamageActionsStateProps) {
  const { state, dispatch } = useMonkState();
  const { handleError } = useMonitoring();
  const { t } = useTranslation();
  const {
    getInspection,
    updateAdditionalData,
    deleteDamage,
    deletePricing,
    updatePricing,
    createPricing,
    createDamage,
  } = useMonkApi(apiConfig);

  const handleAddInteriorDamage = (damage: InteriorDamage, index?: number): void => {
    const callback = (additionalData?: AdditionalData) => {
      const currentDamages =
        (additionalData?.['other_damages'] as unknown as AdditionalData[]) || [];

      if (index !== undefined && currentDamages[index]) {
        const updatedDamages = [...currentDamages];
        updatedDamages[index] = { ...damage } as AdditionalData;
        return {
          ...additionalData,
          other_damages: updatedDamages,
        };
      }

      const updatedDamages = [...currentDamages, damage];
      return {
        ...additionalData,
        other_damages: updatedDamages,
      };
    };

    updateAdditionalData({
      id: inspectionId,
      callback,
    });

    // TODO: implement an optimistic update – display a toast message if fails
    const action: MonkUpdatedOneInspectionAdditionalDataAction = {
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId,
        additionalData: callback(inspection?.additionalData),
      },
    };
    dispatch(action);
  };

  const handleDeleteInteriorDamage = (index: number): void => {
    const callback = (existingData?: AdditionalData) => {
      const currentDamages = (existingData?.['other_damages'] as unknown as AdditionalData[]) || [];
      return {
        ...existingData,
        other_damages: currentDamages.filter((_, i) => i !== index),
      };
    };
    const action: MonkUpdatedOneInspectionAdditionalDataAction = {
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId,
        additionalData: callback(inspection?.additionalData),
      },
    };
    dispatch(action);
    updateAdditionalData({ id: inspectionId, callback });
  };

  function handleDeleteDamagesAndPricing(partToDelete?: Part, pricingToDelete?: PricingV2): void {
    try {
      partToDelete?.damages.forEach((damageId) => {
        deleteDamage({ id: inspectionId, damageId });
      });
      if (pricingToDelete) {
        deletePricing({ id: inspectionId, pricingId: pricingToDelete?.id });
      }
    } catch (e) {
      handleError(e);
      loading.onError();
    }
  }

  function handleUpdatePricing(pricing: number, pricingToModify: PricingV2): void {
    updatePricing({
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

  function handleCreatePricing(damagedPart: DamagedPartDetails, partToUpdate?: Part): void {
    if (damagedPart.pricing === undefined) {
      return;
    }
    createPricing({
      id: inspectionId,
      pricing: {
        pricing: damagedPart.pricing,
        type: PricingV2RelatedItemType.PART,
        vehiclePart: damagedPart.part,
      },
    })
      .then(() => {
        if (!partToUpdate) {
          getInspection({ id: inspectionId, light: false });
        }
      })
      .catch(() => {
        loading.onError(t('inspectionReview.errors.notCompleted'));
      });
  }

  function handleDeleteOldAndCreateNewDamages(
    damagedPart: DamagedPartDetails,
    partToUpdate?: Part,
  ): void {
    const damagesFilteredByPartSelected = state.damages
      .filter((value) => value.inspectionId === inspectionId)
      .filter((damage) => partToUpdate?.damages.includes(damage.id));

    damagesFilteredByPartSelected.forEach((damage) => {
      if (!damagedPart.damageTypes.includes(damage.type)) {
        deleteDamage({ id: inspectionId, damageId: damage.id });
      }
    });

    damagedPart.damageTypes.forEach((damage) => {
      if (!damagesFilteredByPartSelected.map((value) => value.type).includes(damage)) {
        createDamage({ id: inspectionId, damageType: damage, vehiclePart: damagedPart.part });
      }
    });
  }

  /**
   * Helper function to delete damages and pricing for all child parts of a parent part.
   * All damages and pricing associated with the child parts will be assigned to the parent part.
   */
  function handleChildPartDamagesAndPricingDeletion(childParts: VehiclePart[]): void {
    childParts.forEach((childPart) => {
      const childPartToUpdate = state.parts
        .filter((value) => value.inspectionId === inspectionId)
        .find((part) => part.type === childPart);

      const childPricingToModify = state.pricings
        .filter((value) => value.inspectionId === inspectionId)
        .find((pricing) => pricing.relatedItemId === childPartToUpdate?.id);

      if (childPartToUpdate) {
        handleDeleteDamagesAndPricing(childPartToUpdate, childPricingToModify);
      }
    });
  }

  const handleConfirmExteriorDamages = (damagedPart: DamagedPartDetails): void => {
    const partToUpdate = state.parts
      .filter((value) => value.inspectionId === inspectionId)
      .find((part) => part.type === damagedPart.part);

    const pricingToModify = state.pricings
      .filter((value) => value.inspectionId === inspectionId)
      .find((pricing) => pricing.relatedItemId === partToUpdate?.id);

    const childParts = getChildPartsForAggregation(damagedPart.part);
    handleChildPartDamagesAndPricingDeletion(childParts);

    if (!damagedPart.isDamaged) {
      handleDeleteDamagesAndPricing(partToUpdate, pricingToModify);
    }

    if (damagedPart.isDamaged) {
      if (pricingToModify && damagedPart.pricing !== undefined) {
        handleUpdatePricing(damagedPart.pricing, pricingToModify);
      }
      if (!pricingToModify && damagedPart.pricing !== undefined) {
        handleCreatePricing(damagedPart, partToUpdate);
      }

      handleDeleteOldAndCreateNewDamages(damagedPart, partToUpdate);
    }
  };

  return {
    handleAddInteriorDamage,
    handleDeleteInteriorDamage,
    handleConfirmExteriorDamages,
  };
}
