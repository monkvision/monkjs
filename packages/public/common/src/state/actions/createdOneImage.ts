import { Image } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkCreatedOneImageAction.
 */
export interface MonkCreatedOneImagePayload {
  inspectionId: string;
  image: Image;
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
  const images = state.images.filter((image) => image.id !== action.payload.image.id);
  images.push(action.payload.image);
  inspections.forEach((inspection) => {
    if (
      inspection.id === action.payload.inspectionId &&
      !inspection.images.includes(action.payload.image.id)
    ) {
      inspection.images.push(action.payload.image.id);
    }
  });
  return {
    ...state,
    inspections,
    images,
  };
}
