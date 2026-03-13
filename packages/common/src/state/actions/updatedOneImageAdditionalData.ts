import { AdditionalData } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkUpdatedOneImageAdditionalDataPayload.
 */
export interface MonkUpdatedOneImageAdditionalDataPayload {
  /**
   * The ID of the inspection to which the additionalData was updated.
   */
  inspectionId: string;
  /**
   * The image ID deleted.
   */
  imageId: string;
  /**
   * Additional data used for the update operation.
   */
  additionalData: AdditionalData;
}

/**
 * Action dispatched when a image have been updated.
 */
export interface MonkUpdatedOneImageAdditionalDataAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.UPDATED_ONE_IMAGE_ADDITIONAL_DATA`.
   */
  type: MonkActionType.UPDATED_ONE_IMAGE_ADDITIONAL_DATA;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkUpdatedOneImageAdditionalDataPayload;
}

/**
 * Matcher function that matches a UpdatedOneImage while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isUpdatedOneImageAdditionalDataAction(
  action: MonkAction,
): action is MonkUpdatedOneImageAdditionalDataAction {
  return action.type === MonkActionType.UPDATED_ONE_IMAGE_ADDITIONAL_DATA;
}

/**
 * Reducer function for a isUpdatedOneImageAdditionalData action.
 */
export function updatedOneImageAdditionalData(
  state: MonkState,
  action: MonkUpdatedOneImageAdditionalDataAction,
): MonkState {
  const { images } = state;
  const { payload } = action;

  const image = images.find((value) => value.id === payload.imageId);
  if (image) {
    image.additionalData = payload.additionalData;
  }
  return {
    ...state,
    images: [...images],
  };
}
