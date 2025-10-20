import { MonkState } from '../state';
import { MonkAction, MonkActionType } from './monkAction';

/**
 * The payload of a MonkDeletedOneImagePayload.
 */
export interface MonkDeletedOneImagePayload {
  /**
   * The ID of the inspection to which the image was deleted.
   */
  inspectionId: string;
  /**
   * The image ID deleted.
   */
  imageId: string;
}

/**
 * Action dispatched when an image have been deleted.
 */
export interface MonkDeletedOneImageAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.DELETED_ONE_IMAGE`.
   */
  type: MonkActionType.DELETED_ONE_IMAGE;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkDeletedOneImagePayload;
}

/**
 * Matcher function that matches a DeletedOneImage while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isDeletedOneImageAction(action: MonkAction): action is MonkDeletedOneImageAction {
  return action.type === MonkActionType.DELETED_ONE_IMAGE;
}

/**
 * Reducer function for a deletedOneImage action.
 */
export function deletedOneImage(state: MonkState, action: MonkDeletedOneImageAction): MonkState {
  const { images, inspections, damages, parts, renderedOutputs, views } = state;
  const { payload } = action;

  const inspection = inspections.find((value) => value.id === payload.inspectionId);
  if (inspection) {
    inspection.images = inspection.images?.filter((imageId) => imageId !== payload.imageId);
  }
  const deletedImage = images.find((image) => image.id === payload.imageId);
  const newImages = images.filter((image) => image.id !== payload.imageId);
  const newDamages = damages.map((damage) => ({
    ...damage,
    relatedImages: damage.relatedImages.filter((imageId) => imageId !== payload.imageId),
  }));
  const newParts = parts.map((part) => ({
    ...part,
    relatedImages: part.relatedImages.filter((imageId) => imageId !== payload.imageId),
  }));
  const newViews = views.map((view) => ({
    ...view,
    renderedOutputs: view.renderedOutputs.filter(
      (outputId) => !deletedImage?.renderedOutputs.includes(outputId),
    ),
  }));
  const newRenderedOutputs = renderedOutputs.filter(
    (output) => !deletedImage?.renderedOutputs.includes(output.id),
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
