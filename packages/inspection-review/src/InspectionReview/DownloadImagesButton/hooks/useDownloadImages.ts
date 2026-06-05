import { useLoadingState, useObjectMemo } from '@monkvision/common';

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
  handleDownloadPictures: () => void;
}

/**
 * State and handlers for downloading images.
 */
export function useDownloadImages(): DownloadImagesState {
  const loading = useLoadingState();

  const handleDownloadPictures = () => {
    loading.start();
    console.log('Download pictures clicked');
    loading.onSuccess();
  };

  return useObjectMemo({
    loading,
    handleDownloadPictures,
  });
}
