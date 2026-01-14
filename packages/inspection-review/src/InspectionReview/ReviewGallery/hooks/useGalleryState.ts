import { useObjectMemo } from '@monkvision/common';
import { Image } from '@monkvision/types';
import { useCallback, useEffect, useState } from 'react';

/**
 * Props accepted by the useGalleryState hook.
 */
export interface GalleryStateProps {
  /**
   * The list of images to be managed by the gallery state.
   */
  galleryItems: Image[];
}

/**
 * Handle used to manage the gallery state.
 */
export interface HandleGalleryState {
  /**
   * The currently selected image in the gallery.
   */
  selectedImage: Image | null;
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
   * Function to select an image by its ID.
   */
  onSelectImage: (imageId: string) => void;
}

/**
 * Custom hook to manage the state of the gallery, including selected image, navigation, and whether to show damage.
 */
export function useGalleryState({ galleryItems }: GalleryStateProps): HandleGalleryState {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showDamage, setShowDamage] = useState(false);

  const onSelectImage = useCallback(
    (imageId: string) => {
      const image = galleryItems?.find((img) => img.id === imageId) || null;
      setSelectedImage(image);
    },
    [galleryItems],
  );

  const previousImage = useCallback(() => {
    if (selectedImage) {
      const currentIndex = galleryItems?.findIndex((img) => img.id === selectedImage.id);
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
      const previousImage = galleryItems ? galleryItems[previousIndex] : null;

      setSelectedImage(previousImage);
    }
  }, [galleryItems, selectedImage]);

  const nextImage = useCallback(() => {
    if (selectedImage) {
      const currentIndex = galleryItems?.findIndex((img) => img.id === selectedImage.id);
      const nextIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
      const nextImage = galleryItems ? galleryItems[nextIndex] : null;

      setSelectedImage(nextImage);
    }
  }, [galleryItems, selectedImage]);

  useEffect(() => {
    const keyStrokeActions: { [key: string]: () => void } = {
      s: () => setShowDamage(!showDamage),
      S: () => setShowDamage(!showDamage),
      ArrowLeft: previousImage,
      ArrowRight: nextImage,
      q: () => setSelectedImage(null),
      Q: () => setSelectedImage(null),
      Escape: () => setSelectedImage(null),
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
  }, [selectedImage, showDamage]);

  return useObjectMemo({
    selectedImage,
    showDamage,
    previousImage,
    nextImage,
    onSelectImage,
  });
}
