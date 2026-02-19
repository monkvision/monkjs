import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { type Image, Inspection } from '@monkvision/types';
import { LoadingState, useMonkState } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useTranslation } from 'react-i18next';

/**
 * State provided by the InspectionReviewProvider.
 */
export type InspectionReviewState = {
  /**
   * The current inspection data.
   */
  inspection: Inspection | undefined;
  /**
   * The list of images displayed in the Gallery View.
   */
  galleryItems: Image[];
  /**
   * Function to update the gallery items.
   */
  setGalleryItems: (items: Image[]) => void;
};

/**
 * Props accepted by the InspectionReviewProvider.
 */
export interface InspectionReviewProviderProps {
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

  const [galleryItems, setGalleryItems] = useState<Image[]>([]);

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
      }).catch(() => {
        throw new Error(t('inspectionReview.errors.inspectionId'));
      });
      const insp = fetchedInspection.entities.inspections.find(
        (i) => i.id === inspectionId,
      ) as Inspection;

      // a single steering wheel direction - This is passed as parent props to the HOC

      // a list of vehicle type - This is passed as parent props to the HOC
      //  each vehicle has a list of sights ordered - This is passed as parent props to the HOC
      //  any sight in the inspection that doesn't match the above list of sights, should go into a specific Tab, decided by the user (mandatory prop)

      // based on the above detais, we should filter the inspection's sights and assign them to the correct tabs

      setGalleryItems(fetchedInspection.entities.images);

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
    <InspectionReviewStateContext.Provider value={{ inspection, galleryItems, setGalleryItems }}>
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
