import { Image } from '@monkvision/types';
import {
  createEmptyMonkState,
  updatedOneImageAdditionalData,
  isUpdatedOneImageAdditionalDataAction,
  MonkActionType,
  MonkUpdatedOneImageAdditionalDataAction,
} from '../../../src';

const action: MonkUpdatedOneImageAdditionalDataAction = {
  type: MonkActionType.UPDATED_ONE_IMAGE_ADDITIONAL_DATA,
  payload: {
    inspectionId: 'inspections-test',
    imageId: 'image-id-test',
    additionalData: { key1: 'value1', key2: 42 },
  },
};

describe('UpdatedOneImageAdditionalData action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(
        isUpdatedOneImageAdditionalDataAction({
          type: MonkActionType.UPDATED_ONE_IMAGE_ADDITIONAL_DATA,
        }),
      ).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isUpdatedOneImageAdditionalDataAction({ type: MonkActionType.RESET_STATE })).toBe(
        false,
      );
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(updatedOneImageAdditionalData(state, action), state)).toBe(false);
    });

    it('should update the additionalData of the matching image', () => {
      const state = createEmptyMonkState();
      state.images.push({
        id: action.payload.imageId,
        inspectionId: action.payload.inspectionId,
        additionalData: { old: 'data' },
      } as unknown as Image);
      const newState = updatedOneImageAdditionalData(state, action);
      const updatedImage = newState.images.find((img) => img.id === action.payload.imageId);
      expect(updatedImage?.additionalData).toEqual(action.payload.additionalData);
    });

    it('should return a new images array', () => {
      const state = createEmptyMonkState();
      state.images.push({
        id: action.payload.imageId,
        inspectionId: action.payload.inspectionId,
        additionalData: { old: 'data' },
      } as unknown as Image);
      const newState = updatedOneImageAdditionalData(state, action);
      expect(Object.is(newState.images, state.images)).toBe(false);
    });

    it('should not crash if image is not found', () => {
      const state = createEmptyMonkState();
      state.images.push({
        id: 'other-image-id',
        inspectionId: action.payload.inspectionId,
        additionalData: { untouched: true },
      } as unknown as Image);
      const newState = updatedOneImageAdditionalData(state, action);
      expect(newState.images.length).toBe(1);
      expect(newState.images[0].additionalData).toEqual({ untouched: true });
    });

    it('should not modify other images', () => {
      const state = createEmptyMonkState();
      const otherImageData = { untouched: true };
      state.images.push(
        {
          id: action.payload.imageId,
          inspectionId: action.payload.inspectionId,
          additionalData: { old: 'data' },
        } as unknown as Image,
        {
          id: 'other-image-id',
          inspectionId: action.payload.inspectionId,
          additionalData: otherImageData,
        } as unknown as Image,
      );
      const newState = updatedOneImageAdditionalData(state, action);
      const otherImage = newState.images.find((img) => img.id === 'other-image-id');
      expect(otherImage?.additionalData).toEqual({ untouched: true });
    });
  });
});
