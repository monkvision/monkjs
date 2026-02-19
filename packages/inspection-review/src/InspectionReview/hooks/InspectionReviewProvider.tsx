import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Image, ImageStatus, ImageType, Inspection, MonkEntityType } from '@monkvision/types';

/**
 * State provided by the InspectionReviewProvider.
 */
export type InspectionReviewState = {
  /**
   * The current inspection data.
   */
  inspection: Inspection | null;
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
   * Callback to handle updates to the gallery items. Useful when changing between custom tabs.
   */
  handleGalleryUpdate?: (items: Image[]) => void;
  /**
   * The ID of the inspection to be reviewed.
   */
  inspectionId: string;
}

const InspectionReviewStateContext = createContext<InspectionReviewState | null>(null);

export function InspectionReviewState(props: PropsWithChildren<InspectionReviewProviderProps>) {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [galleryItems, setGalleryItems] = useState<Image[]>([]);

  useEffect(() => {
    if (!inspection) {
      // fetch inspection data
      const galleryItems: Image[] = Array.from({ length: 12 }, (_, i) => ({
        id: i.toString(),
        height: 500,
        width: 500,
        entityType: MonkEntityType.IMAGE,
        inspectionId: `${i}`,
        mimetype: 'image/jpeg',
        path: 'image.jpg',
        renderedOutputs: [],
        size: 0,
        status: ImageStatus.SUCCESS,
        thumbnailPath: 'thumb.jpg',
        type: ImageType.CLOSE_UP,
        views: [],
      }));
      const mockedInspection: Inspection = {
        id: props.inspectionId,
        entityType: MonkEntityType.INSPECTION,
        damages: [],
        images: [],
        parts: [],
        tasks: [],
      };
      setInspection(mockedInspection);
      setGalleryItems(galleryItems);
    }
  }, [props.inspectionId]);

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
