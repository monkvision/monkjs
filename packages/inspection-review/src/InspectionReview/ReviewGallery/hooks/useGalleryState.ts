import { useObjectMemo } from '@monkvision/common';
import { useCallback, useState } from 'react';
import { GalleryItem } from '../../types';
import { useInspectionReviewState } from '../../hooks/InspectionReviewProvider';

/**
 * Handle used to manage the gallery state.
 */
export interface HandleGalleryState {
  /**
   * The currently selected item in the gallery.
   */
  selectedItem: GalleryItem | null;
  /**
   * Function to select an item by its image ID.
   */
  onSelectItemById: (imageId: string) => void;
  /**
   * Function to select or deselect an item.
   */
  onSelectItem: (image: GalleryItem | null) => void;
}

/**
 * Custom hook to manage the state of the gallery, including selected image, navigation, and whether to show damage.
 */
export function useGalleryState(): HandleGalleryState {
  const { currentGalleryItems } = useInspectionReviewState();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const onSelectItemById = useCallback(
    (imageId: string) => {
      const image = currentGalleryItems?.find((item) => item.image.id === imageId) || null;
      setSelectedItem(image);
    },
    [currentGalleryItems],
  );

  return useObjectMemo({
    selectedItem,
    onSelectItemById,
    onSelectItem: setSelectedItem,
  });
}
