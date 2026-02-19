import { Sight, type Image, RenderedOutput, Part } from '@monkvision/types';

/**
 * An item in the gallery, consisting of a sights, its image and associated rendered output.
 */
export interface GalleryItem {
  /**
   * The sight of which image will be displayed, if available.
   */
  sight?: Sight;
  /**
   * The image displayed in the gallery.
   */
  image: Image;
  /**
   * The rendered output associated with the image.
   */
  renderedOutput: RenderedOutput | undefined;
  /**
   * Whether the image has an associated damage.
   */
  hasDamage: boolean;
  /**
   * The parts associated with the image.
   */
  parts: Part[];
  /**
   * The total area of polygons associated with the image.
   * Used to sort gallery items by the biggest area first.
   */
  totalPolygonArea: number;
}
