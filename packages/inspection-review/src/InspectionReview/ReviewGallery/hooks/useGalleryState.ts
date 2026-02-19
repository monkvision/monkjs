import { useObjectMemo } from '@monkvision/common';
import { useCallback, useEffect, useState } from 'react';
import { GalleryItem } from '../../hooks';

/**
 * Props accepted by the useGalleryState hook.
 */
export interface GalleryStateProps {
  /**
   * The list of gallery items to be managed by the gallery state.
   */
  galleryItems: GalleryItem[];
}

/**
 * Handle used to manage the gallery state.
 */
export interface HandleGalleryState {
  /**
   * The currently selected item in the gallery.
   */
  selectedItem: GalleryItem | null;
  /**
   * Flag indicating whether to show damage on the selected image.
   */
  showDamage: boolean;
  /**
   * Function to navigate to the previous image in the gallery.
   */
  previousImage: () => void;
  /**
   * Function to navigate to the next image in the gallery.
   */
  nextImage: () => void;
  /**
   * Function to select an item by its image ID.
   */
  onSelectItem: (imageId: string) => void;
}

/**
 * Custom hook to manage the state of the gallery, including selected image, navigation, and whether to show damage.
 */
export function useGalleryState({ galleryItems }: GalleryStateProps): HandleGalleryState {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showDamage, setShowDamage] = useState(false);

  const onSelectItem = useCallback(
    (imageId: string) => {
      const image = galleryItems?.find((item) => item.image.id === imageId) || null;
      setSelectedItem(image);
    },
    [galleryItems],
  );

  const previousImage = useCallback(() => {
    if (selectedItem) {
      const currentIndex = galleryItems?.findIndex(
        (item) => item.image.id === selectedItem.image.id,
      );
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
      const previousImage = galleryItems ? galleryItems[previousIndex] : null;

      setSelectedItem(previousImage);
    }
  }, [galleryItems, selectedItem]);

  const nextImage = useCallback(() => {
    if (selectedItem) {
      const currentIndex = galleryItems?.findIndex(
        (item) => item.image.id === selectedItem.image.id,
      );
      const nextIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
      const nextImage = galleryItems ? galleryItems[nextIndex] : null;

      setSelectedItem(nextImage);
    }
  }, [galleryItems, selectedItem]);

  useEffect(() => {
    const keyStrokeActions: { [key: string]: () => void } = {
      s: () => setShowDamage(!showDamage),
      S: () => setShowDamage(!showDamage),
      ArrowLeft: previousImage,
      ArrowRight: nextImage,
      q: () => setSelectedItem(null),
      Q: () => setSelectedItem(null),
      Escape: () => setSelectedItem(null),
    };

    const handleKeyDown = (event: KeyboardEvent) => {
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
    selectedItem,
    showDamage,
    previousImage,
    nextImage,
    onSelectItem,
  });
}
