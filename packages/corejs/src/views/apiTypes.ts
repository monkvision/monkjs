import { ImageAcquisition, ImageRotation } from '../images/apiTypes';
import { CoreJsResponseWithId, IdResponse, ReponseWithInspectionId } from '../sharedTypes';
import { BoundingBox, View } from './entityTypes';

/**
 * The information given to the API when creating a new view entity to specify the details of the image of this view.
 *
 * *Swagger Schema Reference :* `ViewImagePost`
 */
export interface CreateViewImage {
  /**
   * The name of the image.
   */
  name?: string;
  /**
   * The method that can be used to acquire the image.
   */
  acquisition: ImageAcquisition;
  /**
   * An optional image rotation applied before retreiving it.
   */
  rotateImageBeforeUpload?: ImageRotation;
  /**
   * Additional data attached to the image.
   */
  additionalData?: unknown;
}

/**
 * The information given to the API when creating a new view entity.
 *
 * *Swagger Schema Reference :* `ViewPost`
 */
export interface CreateView {
  /**
   * The id (uuid) of the image where the view is.
   */
  imageId?: string;
  /**
   * The image of this view.
   */
  newImage?: CreateViewImage;
  /**
   * The id (uuid) the damage represented by this view.
   */
  damageId?: string;
  /**
   * The coordinates of the polygons delimiting the damge region.
   */
  polygons?: number[][][];
  /**
   * The bounding box representing the referential of the polygons coordinates.
   */
  boundingBox?: BoundingBox;
}

/**
 * The details of a view entity returned after creating it.
 */
export type CreatedView = Pick<View, 'id' | 'createdAt' | 'imageRegion'>;

/**
 * The type returned by the createOneView method.
 */
export type CreateOneViewResponse = CoreJsResponseWithId<IdResponse<'id'>, CreatedView, 'id'>;

/**
 * The type returned by the createOneView method.
 */
export type DeleteOneViewResponse = CoreJsResponseWithId<IdResponse<'id'>, IdResponse<'id'>, 'id'>
& ReponseWithInspectionId;
