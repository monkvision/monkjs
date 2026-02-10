import { useLoadingState, useObjectMemo } from '@monkvision/common';
import { DownloadImagesButtonProps } from '../../types/download-images.types';
import { useInspectionReviewState } from '../../hooks/InspectionReviewProvider';

/**
 * State and handlers for downloading images.
 */
export interface DownloadImagesState {
  /**
   * Loading state for the image downloading process.
   */
  loading: ReturnType<typeof useLoadingState>;
  /**
   * Handler function to initiate image download.
   */
  handleDownloadImages: () => void;
}

/**
 * State and handlers for downloading images.
 */
export function useDownloadImages(props: DownloadImagesButtonProps): DownloadImagesState {
  const { allGalleryItems } = useInspectionReviewState();
  const loading = useLoadingState();

  const defaultDownloadImages = () => {
    console.log('Download images clicked');
  };

  const handleDownloadImages = () => {
    loading.start();

    try {
      if (props.onDownloadImages) {
        props.onDownloadImages(allGalleryItems);
      } else {
        defaultDownloadImages();
      }
    } finally {
      loading.onSuccess();
    }
  };

  return useObjectMemo({
    loading,
    handleDownloadImages,
  });
}
