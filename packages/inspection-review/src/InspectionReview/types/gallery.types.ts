import { Sight, type Image, RenderedOutput } from '@monkvision/types';

/**
 * An item in the gallery, consisting of a sights, its image and associated rendered output.
 */
export interface GalleryItem {
  /**
   * The sight of which image will be displayed.
   */
  sight: Sight;
  /**
   * The image displayed in the gallery.
   */
  image: Image;
  /**
   * The rendered output associated with the image.
   */
  renderedOutput: RenderedOutput | undefined;
}
