/**
 * Application entity representing a view of a damage on the inspection.
 */
export interface View {
  /**
   * The id (uuid) of the view entity.
   */
  id: string;
  /**
   * Creation date of the view entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the view entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * The id of the where the damage is visible.
   */
  elementId?: string;
  /**
   * The id (uuid) of the user that created this damage entity.
   */
  createdBy?: string;
  /**
   * The region of the image where the damage is located.
   */
  imageRegion?: ImageRegion;
  /**
   * Rendered view of the damage.
   */
  renderedOutputs?: RenderedOutput[];
}

/**
 * Normalized application entity representing a view of a damage on the inspection.
 */
export type NormalizedView = View;

/**
 * A region of an image delimited by a polygon.
 *
 * *Swagger Schema Reference :* `ImageRegion`
 */
export interface ImageRegion {
  /**
   * The id (uuid) of the image region entity.
   */
  id?: string;
  /**
   * The specifications describing the position of the polygon(s) delimiting this region.
   */
  specification: Specification;
  /**
   * The id (uuid) of the image where this region is.
   */
  imageId?: string;
}

/**
 * A specifiation describing the position of one or many polygon(s) delimiting a damage region.
 *
 * *Swagger Schema Reference :* `Specification`
 */
export interface Specification {
  /**
   * The bounding box representing the referential of the polygons coordinates.
   */
  boundingBox?: BoundingBox;
  /**
   * The coordinates of the polygons delimiting the damge region.
   */
  polygons?: number[][][];
}

/**
 * A bounding rectangle representing a referential for damage region coordinates.
 *
 * *Swagger Schema Reference :* `BoundingBox`
 */
export interface BoundingBox {
  /**
   * Minimum X (horizontal) value.
   */
  xmin: number;
  /**
   * Minimum Y (vertical) value.
   */
  ymin: number;
  /**
   * The width of the rectangle.
   */
  width: number;
  /**
   * The height of the rectangle.
   */
  height: number;
}

/**
 * A rendered view of the damage.
 *
 * *Swagger Schema Reference :* `RenderedOutput`
 */
export interface RenderedOutput {
  /**
   * The id (uuid) of the rendered output.
   */
  id: string;
  /**
   * The path of the rendered output.
   */
  path: string;
  /**
   * Creation date of the damage entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the damage entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * The id (uuid) of the original image where the damage can be seen.
   */
  baseImageId?: string;
  /**
   * Extra properties related to the rendered output.
   */
  additionalData?: unknown;
}
