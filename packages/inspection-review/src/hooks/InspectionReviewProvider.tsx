import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useLoadingState, useMonkState, useMonkTheme } from '@monkvision/common';
import { Spinner } from '@monkvision/common-ui-web';
import { CurrencySymbol } from '@monkvision/types';
import { useMonkApi } from '@monkvision/network';
import { useTranslation } from 'react-i18next';
import { sights } from '@monkvision/sights';
import { GalleryItem, DEFAULT_PRICINGS, InspectionReviewProps } from '../types';
import { calculatePolygonArea } from '../utils/galleryItems.utils';
import useDamagedPartsState from './useDamagedPartsState';
import useDamagedPartActionsState from './useDamagedPartActionsState';
import { useGalleryState } from '../ReviewGallery/hooks';
import { useTabsState } from './useTabsState';
import { InspectionReviewStateContext } from './useInspectionReviewProvider';

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

  const isLeftSideCurrency = useMemo(() => currency === CurrencySymbol.USD, [currency]);
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
  const { selectedItem, onSelectItemById, resetSelectedItem } = useGalleryState({
    currentGalleryItems,
  });
  const { allTabs, activeTab, ActiveTabComponent, onTabChange } = useTabsState({
    allGalleryItems,
    currentGalleryItems,
    setCurrentGalleryItems,
    inspection,
    sightsPerTab,
    customTabs: props.customTabs,
    onTabChangeListeners: [resetSelectedItem],
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
        selectedItem,
        onSelectItemById,
        resetSelectedItem,
        allTabs,
        activeTab,
        ActiveTabComponent,
        onTabChange,
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
