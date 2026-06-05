import { useMonitoring } from '@monkvision/monitoring';
import { useMonkApi } from '@monkvision/network';
import {
  LoadingState,
  MonkActionType,
  MonkUpdatedOneInspectionAdditionalDataAction,
  useMonkState,
} from '@monkvision/common';
import { AdditionalData, Inspection } from '@monkvision/types';
import { DamagedPartDetails, InspectionReviewProps, InteriorDamage } from '../types';
import { getChildPartsForAggregation } from '../utils/partAggregation.utils';
import {
  handleChildPartDamagesAndPricingDeletion,
  handleCreatePricing,
  handleDeleteDamagesAndPricing,
  handleDeleteOldAndCreateNewDamages,
  handleUpdatePricing,
} from '../utils/useDamagedPartActionsState.utils';

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
  const monkApi = useMonkApi(apiConfig);

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

    monkApi.updateAdditionalData({
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
    monkApi.updateAdditionalData({ id: inspectionId, callback });
  };

  const handleConfirmExteriorDamages = (damagedPart: DamagedPartDetails): void => {
    try {
      const partToUpdate = state.parts
        .filter((value) => value.inspectionId === inspectionId)
        .find((part) => part.type === damagedPart.part);

      const pricingToModify = state.pricings
        .filter((value) => value.inspectionId === inspectionId)
        .find((pricing) => pricing.relatedItemId === partToUpdate?.id);

      const childParts = getChildPartsForAggregation(damagedPart.part);
      handleChildPartDamagesAndPricingDeletion(monkApi, state, inspectionId, childParts);

      if (!damagedPart.isDamaged) {
        handleDeleteDamagesAndPricing(monkApi, inspectionId, partToUpdate, pricingToModify);
      }

      if (damagedPart.isDamaged) {
        if (pricingToModify && damagedPart.pricing !== undefined) {
          handleUpdatePricing(
            monkApi,
            inspectionId,
            dispatch,
            damagedPart.pricing,
            pricingToModify,
          );
        }
        if (!pricingToModify && damagedPart.pricing !== undefined) {
          handleCreatePricing(monkApi, inspectionId, damagedPart, partToUpdate);
        }

        handleDeleteOldAndCreateNewDamages(monkApi, state, inspectionId, damagedPart, partToUpdate);
      }
    } catch (e) {
      handleError(e);
      loading.onError();
    }
  };

  return {
    handleAddInteriorDamage,
    handleDeleteInteriorDamage,
    handleConfirmExteriorDamages,
  };
}
