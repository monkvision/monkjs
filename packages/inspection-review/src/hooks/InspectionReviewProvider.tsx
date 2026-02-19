import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useLoadingState, useMonkState, useMonkTheme } from '@monkvision/common';
import { Spinner } from '@monkvision/common-ui-web';
import { Inspection } from '@monkvision/types';
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
import useDamagedPartsState from './useDamagedPartsState';
import useDamagedPartActionsState from './useDamagedPartActionsState';

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
  const { palette } = useMonkTheme();
  const { state } = useMonkState();
  const { getInspection } = useMonkApi(apiConfig);
  const { damagedPartsDetails } = useDamagedPartsState({ inspectionId });

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
  const { handleAddInteriorDamage, handleDeleteInteriorDamage, handleConfirmExteriorDamages } =
    useDamagedPartActionsState({
      inspectionId,
      apiConfig,
      inspection,
      loading,
    });

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
        throw new Error(t('errors.inspectionId'));
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
      {typeof loading.error === 'string' && (
        <div style={{ color: palette.text.primary }}>{loading.error}</div>
      )}
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
