import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { type Image, Inspection, RenderedOutput, Sight } from '@monkvision/types';
import { LoadingState, useMonkState } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useTranslation } from 'react-i18next';
import { InspectionReviewProps } from '../InspectionReview';
import { sights } from '@monkvision/sights';

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
  const { state } = useMonkState();
  const { getInspection } = useMonkApi(apiConfig);

  const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
  const [currentGalleryItems, setCurrentGalleryItems] = useState<GalleryItem[]>([]);

  const inspection = useMemo(
    () => state.inspections.find((i) => i.id === inspectionId),
    [state.inspections, inspectionId],
  );

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
      const insp = fetchedInspection.entities.inspections.find(
        (i) => i.id === inspectionId,
      ) as Inspection;

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
      console.log({ insp, fetchedInspection, items });

      // TODO: group sight IDs by category
      // const exteriorSightIds: Record<string, string> = {};
      // const interiorSightIds: Record<string, string> = {};
      // const unmatchedSightIds: Record<string, string> = {};
      // sightAndImageIds.forEach((sightAndImage) => {
      //   if (sights[sightAndImage[0]]?.category === 'exterior') {
      //     exteriorSightIds[sightAndImage[0]] = sightAndImage[1];
      //   } else if (sights[sightAndImage[0]]?.category === 'interior') {
      //     interiorSightIds[sightAndImage[0]] = sightAndImage[1];
      //   } else {
      //     unmatchedSightIds[sightAndImage[0]] = sightAndImage[1];
      //   }
      // });

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
      value={{ inspection, allGalleryItems, currentGalleryItems, setCurrentGalleryItems }}
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
