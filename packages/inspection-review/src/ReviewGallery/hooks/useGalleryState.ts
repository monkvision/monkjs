import { useObjectMemo } from '@monkvision/common';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GalleryItem } from '../../types';
import { useInspectionReviewProvider } from '../../hooks/InspectionReviewProvider';

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
   * If passing null as parameter, deselects the current item.
   */
  onSelectItemById: (imageId: string | null) => void;
}

/**
 * Custom hook to manage the state of the gallery, including selected image, navigation, and whether to show damage.
 */
export function useGalleryState(): HandleGalleryState {
  const { currentGalleryItems } = useInspectionReviewProvider();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const isSelectedItemAvailable = useMemo<boolean>(
    () =>
      !!selectedItem &&
      !!currentGalleryItems.find((item) => item.image.id === selectedItem?.image.id),
    [currentGalleryItems, selectedItem],
  );

  useEffect(() => {
    if (!isSelectedItemAvailable) {
      setSelectedItem(null);
    }
  }, [isSelectedItemAvailable]);

  const onSelectItemById = useCallback(
    (imageId: string | null) => {
      if (imageId === null) {
        setSelectedItem(null);
        return;
      }
      const image = currentGalleryItems?.find((item) => item.image.id === imageId) || null;
      setSelectedItem(image);
    },
    [currentGalleryItems],
  );

  return useObjectMemo({
    selectedItem,
    onSelectItemById,
  });
}
