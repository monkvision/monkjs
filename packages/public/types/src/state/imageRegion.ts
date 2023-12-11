import { MonkEntity, MonkEntityType } from './entity';

/**
 * Type definition for a polygon drawn on an image, usually used to mark a damage on an image view. Polygons are
 * represented by an array of N points, each point being defined as an array of exactly 2 integers representing
 * respectively the X and Y coordinates (in pixels) of the point in the image.
 */
export type Polygon = number[][];

/**
 * This object defines the coordinates of an element (a part, a damage, a sub image etc.) on an image.
 */
export interface BoundingBox {
  /**
   * The smallest X coordinate of the BoundingBox's rectangle.
   */
  xMin: number;
  /**
   * The smallest Y coordinate of the BoundingBox's rectangle.
   */
  yMin: number;
  /**
   * The width of the BoundingBox's rectangle.
   */
  width: number;
  /**
   * The height of the BoundingBox's rectangle.
   */
  height: number;
}

/**
 * Specifications of an image region.
 */
export interface ImageRegionSpecification {
  /**
   * The bounding box (in pixels) of the image region compared to the original image.
   */
  boundingBox: BoundingBox;
  /**
   * The polygons drawn on this image region.
   */
  polygons: Polygon[];
}

/**
 * An image region corresponds to a section of an image that contains useful information such as damages etc.
 */
export interface ImageRegion extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.IMAGE_REGION;
  /**
   * The specifications of the image region, such as its bounding box or the polygons drawn in the region.
   */
  specification: ImageRegionSpecification;
}
