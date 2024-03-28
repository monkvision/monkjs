import { Image } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkCreatedOneImageAction.
 */
export interface MonkCreatedOneImagePayload {
  /**
   * The ID of the inspection to which the image was added.
   */
  inspectionId: string;
  /**
   * The created image.
   */
  image: Image;
  /**
   * This ID is used when you first want to create the entity locally while you wait for the API to give you the true
   * ID of the image. You first create the image with a custom local ID, then you dispatch the action a second time
   * and specify this custom ID in the `localId` param. The image will then be updated instead of added.
   */
  localId?: string;
}

/**
 * Action dispatched when an image has been uploaded to the API.
 */
export interface MonkCreatedOneImageAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.CREATED_ONE_IMAGE`.
   */
  type: MonkActionType.CREATED_ONE_IMAGE;
  /**
   * The payload of the action.
   */
  payload: MonkCreatedOneImagePayload;
}

/**
 * Matcher function that matches a CreatedOneImage while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isCreatedOneImageAction(action: MonkAction): action is MonkCreatedOneImageAction {
  return action.type === MonkActionType.CREATED_ONE_IMAGE;
}

/**
 * Reducer function for a CreatedOneImage action.
 */
export function createdOneImage(state: MonkState, action: MonkCreatedOneImageAction): MonkState {
  const { inspections } = state;
  const images = state.images.filter(
    (image) => ![action.payload.image.id, action.payload.localId].includes(image.id),
  );
  images.push(action.payload.image);
  const imageInspection = inspections.find(
    (inspection) => inspection.id === action.payload.inspectionId,
  );
  if (imageInspection) {
    imageInspection.images = imageInspection.images.filter(
      (imageId) => ![action.payload.image.id, action.payload.localId].includes(imageId),
    );
    imageInspection.images.push(action.payload.image.id);
  }
  return {
    ...state,
    inspections,
    images,
  };
}
