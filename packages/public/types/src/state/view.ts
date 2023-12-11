import { MonkEntity, MonkEntityType } from './entity';

/**
 * A view associated with an image in an inspection. A view is defined as a transformation, annotation or crop of an
 * inspection image which provides more information on the algorithms detections. For instance, a view can be a zoomed
 * and cropped version of an inspection image that focuses on a detected scratch.
 */
export interface View extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.VIEW;
  /**
   * The ID of the element that is View entity is associated with. This ID can be the ID of a part, a damage etc.
   */
  elementId: string;
  /**
   * The ID of the image region entity associated with this View entity.
   */
  imageRegion: string;
  /**
   * The IDs of the rendered outputs generated for this View.
   */
  renderedOutputs: string[];
}
