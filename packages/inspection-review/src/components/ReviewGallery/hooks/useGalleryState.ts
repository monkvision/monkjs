import { useObjectMemo } from '@monkvision/common';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GalleryItem } from '../../../types';
import { InspectionReviewProviderState } from '../../../types/inspection-review.types';

/**
 * Parameters accepted by the useGalleryState hook.
 */
export interface UseGalleryStateParams
  extends Pick<InspectionReviewProviderState, 'currentGalleryItems'> {}

/**
 * Handle used to manage the gallery state.
 */
export interface HandleGalleryState
  extends Pick<
    InspectionReviewProviderState,
    'selectedItem' | 'onSelectItemById' | 'resetSelectedItem'
  > {}

/**
 * Custom hook to manage the state of the selecting and deselecting items in the gallery.
 */
export function useGalleryState({
  currentGalleryItems,
}: UseGalleryStateParams): HandleGalleryState {
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

  const resetSelectedItem = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return useObjectMemo({
    selectedItem,
    onSelectItemById,
    resetSelectedItem,
  });
}
