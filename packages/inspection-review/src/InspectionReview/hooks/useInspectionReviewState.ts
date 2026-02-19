import { Image, ImageStatus, ImageType, Inspection, MonkEntityType } from '@monkvision/types';
import { useEffect, useState } from 'react';

/**
 * Props accepted by the useInspectionReviewState hook.
 */
export interface useInspectionReviewStateProps {
  /**
   * Callback to handle updates to the gallery items. Useful when changing between custom tabs.
   */
  handleGalleryUpdate?: (items: Image[]) => void;
  /**
   * The ID of the inspection to be reviewed.
   */
  inspectionId: string;
}

/**
 * Handle used to manage the inspection review state.
 */
export interface HandleInspectionReviewState {
  /**
   * The current inspection data.
   */
  inspection: Inspection | null;
  /**
   * The list of images displayed in the Gallery View.
   */
  galleryItems: Image[];
}

/**
 * Custom hook to manage the state of the inspection review, including fetching inspection data and gallery items.
 */
export function useInspectionReviewState({
  inspectionId,
}: useInspectionReviewStateProps): HandleInspectionReviewState {
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
        id: inspectionId,
        entityType: MonkEntityType.INSPECTION,
        damages: [],
        images: [],
        parts: [],
        tasks: [],
      };
      setInspection(mockedInspection);
      setGalleryItems(galleryItems);
    }
  }, [inspectionId]);

  return { inspection, galleryItems };
}
