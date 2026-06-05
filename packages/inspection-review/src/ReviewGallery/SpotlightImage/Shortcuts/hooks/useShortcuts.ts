import { useObjectMemo } from '@monkvision/common';
import { useCallback, useEffect, useState } from 'react';
import { useInspectionReviewProvider } from '../../../../hooks/InspectionReviewProvider';
import { HandleGalleryState } from '../../../hooks';

/**
 * Props accepted by the useShortcuts hook.
 */
export type UseShortcutsProps = Pick<HandleGalleryState, 'selectedItem' | 'onSelectItemById'>;

/**
 * Handle used to manage the shortcuts state.
 */
export interface UseShortcutsState {
  /**
   * Flag indicating whether to show damage on the selected image.
   */
  showDamage: boolean;
  /**
   * Function to toggle the show damage state.
   */
  toggleShowDamage: () => void;
  /**
   * Function to navigate to the previous image in the gallery.
   */
  goToPreviousImage: () => void;
  /**
   * Function to navigate to the next image in the gallery.
   */
  goToNextImage: () => void;
}

/**
 * Custom hook to manage keyboard shortcuts for image navigation and damage toggling.
 */
export function useShortcuts({
  selectedItem,
  onSelectItemById,
}: UseShortcutsProps): UseShortcutsState {
  const { currentGalleryItems } = useInspectionReviewProvider();
  const [showDamage, setShowDamage] = useState(false);

  const toggleShowDamage = () => {
    setShowDamage(!showDamage);
  };

  const goToPreviousImage = useCallback(() => {
    if (selectedItem) {
      const currentIndex = currentGalleryItems?.findIndex(
        (item) => item.image.id === selectedItem.image.id,
      );
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : currentGalleryItems.length - 1;
      const previousImage = currentGalleryItems ? currentGalleryItems[previousIndex] : null;

      onSelectItemById(previousImage?.image.id || null);
    }
  }, [currentGalleryItems, selectedItem]);

  const goToNextImage = useCallback(() => {
    if (selectedItem) {
      const currentIndex = currentGalleryItems?.findIndex(
        (item) => item.image.id === selectedItem.image.id,
      );
      const nextIndex = currentIndex < currentGalleryItems.length - 1 ? currentIndex + 1 : 0;
      const nextImage = currentGalleryItems ? currentGalleryItems[nextIndex] : null;

      onSelectItemById(nextImage?.image.id || null);
    }
  }, [currentGalleryItems, selectedItem]);

  useEffect(() => {
    const keyStrokeActions: { [key: string]: () => void } = {
      s: () => setShowDamage(!showDamage),
      S: () => setShowDamage(!showDamage),
      ArrowLeft: goToPreviousImage,
      ArrowRight: goToNextImage,
      q: () => onSelectItemById(null),
      Q: () => onSelectItemById(null),
      Escape: () => onSelectItemById(null),
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isEditable =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isEditable) {
        return;
      }

      const action = keyStrokeActions[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, showDamage]);

  return useObjectMemo({
    showDamage,
    toggleShowDamage,
    goToPreviousImage,
    goToNextImage,
  });
}
