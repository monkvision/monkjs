import { GalleryItem } from './gallery.types';

/**
 * Props accepted by the DownloadImagesButton component.
 */
export interface DownloadImagesButtonProps {
  /**
   * Callback function triggered when the image download is requested.
   */
  onDownloadImages?: (allGalleryItems: GalleryItem[]) => void;
}
