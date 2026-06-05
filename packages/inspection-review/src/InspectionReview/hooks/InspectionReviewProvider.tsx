import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  MonkActionType,
  MonkUpdatedOneInspectionAdditionalDataAction,
  MonkUpdatedOnePricingAction,
  useLoadingState,
  useMonkState,
} from '@monkvision/common';
import { Spinner } from '@monkvision/common-ui-web';
import {
  AdditionalData,
  DamageType,
  Inspection,
  MonkEntityType,
  PricingV2RelatedItemType,
} from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { useMonkApi } from '@monkvision/network';
import { useTranslation } from 'react-i18next';
import { sights } from '@monkvision/sights';
import {
  GalleryItem,
  DEFAULT_PRICINGS,
  PricingData,
  DamagedPartDetails,
  InspectionReviewProps,
  InteriorDamage,
} from '../types';

/**
 * State provided by the InspectionReviewProvider.
 */
export type InspectionReviewProvider = Pick<InspectionReviewProps, 'vehicleTypes' | 'currency'> & {
  /**
   * The current inspection data.
   */
  inspection: Inspection | undefined;
  /**
   * The list of images available for this review.
   */
  allGalleryItems: GalleryItem[];
  /**
   * The currently items displayed in the gallery.
   */
  currentGalleryItems: GalleryItem[];
  /**
   * Available prices to be displayed in the price legend section.
   */
  availablePricings: Record<string, PricingData>;
  /**
   * Details about the parts that have been marked as damaged in the inspection.
   */
  damagedPartsDetails: DamagedPartDetails[];
  /**
   * Function to update the currently displayed gallery items.
   */
  setCurrentGalleryItems: (items: GalleryItem[]) => void;
  /**
   * Function to handle adding new interior damage and updating the state.
   * If an index is provided, it updates the existing damage at that index.
   */
  handleAddInteriorDamage: (damage: InteriorDamage, index?: number) => void;
  /**
   * Function to handle deleting interior damage by index.
   */
  handleDeleteInteriorDamage: (index: number) => void;
  /**
   * Function to handle confirming exterior damages of a part. It can add or remove damages for a part,
   * or update the pricing information.
   */
  handleConfirmExteriorDamages: (damagedPart: DamagedPartDetails) => void;
};

const InspectionReviewStateContext = createContext<InspectionReviewProvider | null>(null);

/**
 * The InspectionReviewProvider component that provides inspection review state to its children.
 */
export function InspectionReviewProvider(props: PropsWithChildren<InspectionReviewProps>) {
  const { inspectionId, apiConfig, vehicleTypes, currency } = props;

  const loading = useLoadingState(true);
  const { t } = useTranslation();
  const { state, dispatch } = useMonkState();
  const { handleError } = useMonitoring();
  const {
    getInspection,
    updateAdditionalData,
    deleteDamage,
    deletePricing,
    updatePricing,
    createPricing,
    createDamage,
  } = useMonkApi(apiConfig);

  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [currentGalleryItems, setCurrentGalleryItems] = useState<GalleryItem[]>([]);

  const inspection = useMemo(
    () => state.inspections.find((i) => i.id === inspectionId),
    [state.inspections, inspectionId],
  );

  const availablePricings = useMemo(
    () => ({
      ...DEFAULT_PRICINGS,
      ...props.pricings,
    }),
    [props.pricings],
  );

  const handleAddInteriorDamage = (damage: InteriorDamage, index?: number) => {
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

    const action: MonkUpdatedOneInspectionAdditionalDataAction = {
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId,
        additionalData: callback(inspection?.additionalData),
      },
    };
    dispatch(action);
  };

  const damagedPartsDetails = useMemo(() => {
    const parts: DamagedPartDetails[] = state.parts
      .filter((part) => part.inspectionId === inspectionId)
      .map((part) => {
        const damageTypes = part.damages.reduce<DamageType[]>((acc, damageId) => {
          const damage = state.damages.find((value) => value.id === damageId)?.type;
          if (damage) {
            acc.push(damage);
          }
          return acc;
        }, []);
        const pricingObj = state.pricings.find((price) => price.relatedItemId === part.id);
        const pricing = pricingObj?.pricing;
        return { part: part.type, damageTypes, pricing, isDamaged: damageTypes.length > 0 };
      });

    return parts;
  }, [state]);

  const handleDeleteInteriorDamage = (index: number) => {
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

  const handleConfirmExteriorDamages = (damagedPart: DamagedPartDetails) => {
    const partToUpdate = state.parts
      .filter((value) => value.inspectionId === inspectionId)
      .find((part) => part.type === damagedPart.part);

    const pricingToModify = state.pricings
      .filter((value) => value.inspectionId === inspectionId)
      .find((pricing) => pricing.relatedItemId === partToUpdate?.id);

    if (!damagedPart.isDamaged) {
      try {
        partToUpdate?.damages.forEach((damageId) => {
          deleteDamage({ id: inspectionId, damageId });
        });
        if (pricingToModify) {
          deletePricing({ id: inspectionId, pricingId: pricingToModify?.id });
        }
      } catch (e) {
        handleError(e);
        loading.onError();
      }
    }

    if (damagedPart.isDamaged) {
      if (pricingToModify && damagedPart.pricing !== undefined) {
        const action: MonkUpdatedOnePricingAction = {
          type: MonkActionType.UPDATED_ONE_PRICING,
          payload: {
            pricing: {
              entityType: MonkEntityType.PRICING,
              id: pricingToModify.id,
              inspectionId,
              relatedItemType: PricingV2RelatedItemType.PART,
              pricing: damagedPart.pricing,
            },
          },
        };
        dispatch(action);
        updatePricing({
          id: inspectionId,
          pricingId: pricingToModify.id,
          price: damagedPart.pricing,
        });
      }

      if (!pricingToModify && damagedPart.pricing) {
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
              getInspection({ id: inspectionId });
            }
          })
          .catch(() => {
            loading.onError(t('inspectionReview.errors.notCompleted'));
          });
      }

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
  };

  useEffect(() => {
    loading.start();

    const fetchInspection = async () => {
      if (!inspectionId) {
        loading.onSuccess();
        return;
      }
      const fetchedInspection = await getInspection({
        id: inspectionId,
        light: false,
      }).catch(() => {
        throw new Error(t('inspectionReview.errors.inspectionId'));
      });

      const items: GalleryItem[] = [];
      fetchedInspection.entities.images.forEach((img) => {
        const sightId = img.sightId || img.additionalData?.sight_id;
        if (sightId) {
          const sight = sights[sightId];
          const renderedOutput = fetchedInspection.entities.renderedOutputs.find(
            (item) =>
              item.additionalData?.['description'] === 'rendering of detected damages' &&
              img.renderedOutputs.includes(item.id),
          );
          items.push({
            image: img,
            sight,
            renderedOutput,
          });
        }
      });

      setAllGalleryItems(items);
      loading.onSuccess();
    };

    fetchInspection()
      .then(loading.onSuccess)
      .catch((e) => {
        const error = e as Error;
        loading.onError(error.message);
      });
  }, [inspectionId]);

  return (
    <InspectionReviewStateContext.Provider
      value={{
        inspection,
        allGalleryItems,
        currentGalleryItems,
        setCurrentGalleryItems,
        vehicleTypes,
        currency,
        availablePricings,
        damagedPartsDetails,
        handleAddInteriorDamage,
        handleDeleteInteriorDamage,
        handleConfirmExteriorDamages,
      }}
    >
      {loading.isLoading ? <Spinner /> : props.children}
    </InspectionReviewStateContext.Provider>
  );
}

export function useInspectionReviewState(): InspectionReviewProvider {
  const ctx = useContext(InspectionReviewStateContext);
  if (!ctx) {
    throw new Error('useInspectionReviewState must be used inside InspectionReviewStateProvider');
  }
  return ctx;
}
