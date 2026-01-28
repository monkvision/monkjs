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
  Currencies,
} from '../types';
import { calculatePolygonArea } from '../utils/galleryItems.utils';

/**
 * State provided by the InspectionReviewProvider.
 */
export type InspectionReviewProviderState = Pick<
  InspectionReviewProps,
  'vehicleType' | 'currency' | 'sightsPerTab' | 'additionalInfo'
> & {
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
   * The currency symbol position indicator autocalculated based on the currency property.
   * If currency is $, this will be true.
   *
   * @example
   * // For Currencies.USD
   * isLeftSideCurrency = true; // $100
   *
   * // For Currencies.EUR
   * isLeftSideCurrency = false; // 100€
   */
  isLeftSideCurrency: boolean;
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

const InspectionReviewStateContext = createContext<InspectionReviewProviderState | null>(null);

/**
 * The InspectionReviewProvider component that provides inspection review state to its children.
 */
export function InspectionReviewProvider(props: PropsWithChildren<InspectionReviewProps>) {
  const { inspectionId, apiConfig, vehicleType, currency, sightsPerTab, additionalInfo } = props;

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
  const isLeftSideCurrency = useMemo(() => currency === Currencies.USD, [currency]);

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

    // TODO: implement a optimistic update for this, prompt the user with a toast like message if it fails
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
        const damageTypes: DamageType[] = part.damages.reduce<DamageType[]>((acc, damageId) => {
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
              getInspection({ id: inspectionId, light: false });
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
      const { damages } = fetchedInspection.body;
      const { parts } = fetchedInspection.entities;

      fetchedInspection.entities.images.forEach((img) => {
        const imageBody = fetchedInspection.body.images.find((image) => image.id === img.id);
        if (!imageBody) {
          return;
        }

        const sightId = img.sightId || img.additionalData?.sight_id;
        let sight;
        if (sightId) {
          sight = sights[sightId];
        }

        const imageViews = imageBody.views;
        const imageParts = parts.filter((part) =>
          imageViews?.some((view) => part.id === view.element_id),
        );
        const hasDamage = damages.some((damage) =>
          imageViews?.find((view) => view.element_id === damage.id),
        );

        let totalPolygonArea = 0;
        if (hasDamage && imageViews) {
          if (!imageViews[0].image_region.specification.polygons) {
            return;
          }
          totalPolygonArea = imageViews[0].image_region.specification.polygons.reduce(
            (sum, polygon) => sum + calculatePolygonArea(polygon),
            0,
          );
        }

        const renderedOutput = fetchedInspection.entities.renderedOutputs.find(
          (item) =>
            item.additionalData?.['description'] === 'rendering of detected damages' &&
            img.renderedOutputs.includes(item.id),
        );
        items.push({
          image: img,
          sight,
          renderedOutput,
          hasDamage,
          parts: imageParts,
          totalPolygonArea,
        });
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
        vehicleType,
        currency,
        availablePricings,
        additionalInfo,
        damagedPartsDetails,
        handleAddInteriorDamage,
        handleDeleteInteriorDamage,
        handleConfirmExteriorDamages,
        sightsPerTab,
        isLeftSideCurrency,
      }}
    >
      {loading.isLoading && <Spinner primaryColor='gray' size={80} />}
      {typeof loading.error === 'string' && <div style={{ color: 'black' }}>{loading.error}</div>}
      {!loading.isLoading && !loading.error && props.children}
    </InspectionReviewStateContext.Provider>
  );
}

export function useInspectionReviewProvider(): InspectionReviewProviderState {
  const ctx = useContext(InspectionReviewStateContext);
  if (!ctx) {
    throw new Error(
      'useInspectionReviewProvider must be used inside InspectionReviewStateProvider',
    );
  }
  return ctx;
}
