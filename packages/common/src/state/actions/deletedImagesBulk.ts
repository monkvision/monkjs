import { MonkState } from '../state';
import { MonkAction, MonkActionType } from './monkAction';

/**
 * The payload of a MonkDeletedImagesBulkAction.
 */
export interface MonkDeletedImagesBulkPayload {
  /**
   * The ID of the inspection from which the images were deleted.
   */
  inspectionId: string;
  /**
   * The IDs of the images that were deleted.
   */
  imageIds: string[];
}

/**
 * Action dispatched when multiple images have been deleted in bulk.
 */
export interface MonkDeletedImagesBulkAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.DELETED_IMAGES_BULK`.
   */
  type: MonkActionType.DELETED_IMAGES_BULK;
  /**
   * The payload of the action containing the deleted image IDs.
   */
  payload: MonkDeletedImagesBulkPayload;
}

/**
 * Matcher function that matches a DeletedImagesBulk while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isDeletedImagesBulkAction(
  action: MonkAction,
): action is MonkDeletedImagesBulkAction {
  return action.type === MonkActionType.DELETED_IMAGES_BULK;
}

/**
 * Reducer function for a deletedImagesBulk action.
 */
export function deletedImagesBulk(
  state: MonkState,
  action: MonkDeletedImagesBulkAction,
): MonkState {
  const { images, inspections, damages, parts, renderedOutputs, views } = state;
  const { payload } = action;
  const deletedIds = new Set(payload.imageIds);

  const inspection = inspections.find((value) => value.id === payload.inspectionId);
  if (inspection) {
    inspection.images = inspection.images?.filter((imageId) => !deletedIds.has(imageId));
  }

  const deletedImages = images.filter((image) => deletedIds.has(image.id));
  const deletedRenderedOutputIds = new Set(deletedImages.flatMap((image) => image.renderedOutputs));

  const newImages = images.filter((image) => !deletedIds.has(image.id));
  const newDamages = damages.map((damage) => ({
    ...damage,
    relatedImages: damage.relatedImages.filter((imageId) => !deletedIds.has(imageId)),
  }));
  const newParts = parts.map((part) => ({
    ...part,
    relatedImages: part.relatedImages.filter((imageId) => !deletedIds.has(imageId)),
  }));
  const newViews = views.map((view) => ({
    ...view,
    renderedOutputs: view.renderedOutputs.filter(
      (outputId) => !deletedRenderedOutputIds.has(outputId),
    ),
  }));
  const newRenderedOutputs = renderedOutputs.filter(
    (output) => !deletedRenderedOutputIds.has(output.id),
  );

  return {
    ...state,
    images: [...newImages],
    inspections: [...inspections],
    damages: [...newDamages],
    parts: [...newParts],
    renderedOutputs: [...newRenderedOutputs],
    views: [...newViews],
  };
}
