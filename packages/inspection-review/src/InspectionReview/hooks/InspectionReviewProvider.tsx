import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { AdditionalData, type Image, Inspection, RenderedOutput, Sight } from '@monkvision/types';
import {
  LoadingState,
  MonkActionType,
  MonkUpdatedOneInspectionAdditionalDataAction,
  useMonkState,
} from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useTranslation } from 'react-i18next';
import { InspectionReviewProps } from '../InspectionReview';
import { sights } from '@monkvision/sights';
import { InteriorDamage } from '../InteriorTab';

/**
 * An item in the gallery, consisting of a sights, its image and associated rendered output.
 */
export interface GalleryItem {
  /**
   * The sight of which image will be displayed.
   */
  sight: Sight;
  /**
   * The image displayed in the gallery.
   */
  image: Image;
  /**
   * The rendered output associated with the image.
   */
  renderedOutput: RenderedOutput | undefined;
}

/**
 * State provided by the InspectionReviewProvider.
 */
export type InspectionReviewState = {
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
   * Function to update the currently displayed gallery items.
   */
  setCurrentGalleryItems: (items: GalleryItem[]) => void;
  /**
   * Function to handle adding new interior damage and updating the state.
   * If an index is provided, it updates the existing damage at that index.
   */
  handleAddDamage: (damage: InteriorDamage, index?: number) => void;
  /**
   * Function to handle deleting interior damage by index.
   */
  handleDeleteDamage: (index: number) => void;
};

/**
 * Props accepted by the InspectionReviewProvider.
 */
export interface InspectionReviewProviderProps extends Partial<InspectionReviewProps> {
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * The ID of the inspection to be reviewed.
   */
  inspectionId: string;
  /**
   * The loading state to manage loading status.
   */
  loading: LoadingState;
}

const InspectionReviewStateContext = createContext<InspectionReviewState | null>(null);

/**
 * The InspectionReviewProvider component that provides inspection review state to its children.
 */
export function InspectionReviewState(props: PropsWithChildren<InspectionReviewProviderProps>) {
  const { inspectionId, loading, apiConfig } = props;

  const { t } = useTranslation();
  const { state, dispatch } = useMonkState();
  const { getInspection, updateAdditionalData } = useMonkApi(apiConfig);

  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [currentGalleryItems, setCurrentGalleryItems] = useState<GalleryItem[]>([]);

  const inspection = useMemo(
    () => state.inspections.find((i) => i.id === inspectionId),
    [state.inspections, inspectionId],
  );

  const handleAddDamage = (damage: InteriorDamage, index?: number) => {
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

  const handleDeleteDamage = (index: number) => {
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

  console.log({ inspection, state });

  return (
    <InspectionReviewStateContext.Provider
      value={{
        inspection,
        allGalleryItems,
        currentGalleryItems,
        setCurrentGalleryItems,
        handleAddDamage,
        handleDeleteDamage,
      }}
    >
      {props.children}
    </InspectionReviewStateContext.Provider>
  );
}

export function useInspectionReviewState(): InspectionReviewState {
  const ctx = useContext(InspectionReviewStateContext);
  if (!ctx) {
    throw new Error('useInspectionReviewState must be used inside InspectionReviewStateProvider');
  }
  return ctx;
}
