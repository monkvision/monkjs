import {
  createdOneImage,
  createEmptyMonkState,
  isCreatedOneImageAction,
  MonkActionType,
  MonkCreatedOneImageAction,
} from '../../../src';
import { Image, ImageType, Inspection } from '@monkvision/types';

const action: MonkCreatedOneImageAction = {
  type: MonkActionType.CREATED_ONE_IMAGE,
  payload: {
    inspectionId: 'inspectionId',
    image: {
      id: 'imageId',
      type: ImageType.BEAUTY_SHOT,
    } as Image,
  },
};

global.URL.revokeObjectURL = jest.fn();

describe('CreatedOneImage action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isCreatedOneImageAction({ type: MonkActionType.CREATED_ONE_IMAGE })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isCreatedOneImageAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(createdOneImage(state, action), state)).toBe(false);
    });

    it('should add the image to the state if it does not exist already', () => {
      const state = createEmptyMonkState();
      state.images.push({ id: 'coucou' } as Image);
      const newState = createdOneImage(state, action);
      expect(newState.images.length).toBe(2);
      expect(newState.images).toContainEqual(action.payload.image);
    });

    it('should modify the image in the state if it exists already', () => {
      const state = createEmptyMonkState();
      state.images.push({ id: action.payload.image.id, siblingKey: 'test-wow-wow' } as Image);
      const newState = createdOneImage(state, action);
      expect(newState.images[0]).toEqual(action.payload.image);
    });

    it('should add the image to the inspection', () => {
      const state = createEmptyMonkState();
      state.inspections.push({
        id: action.payload.inspectionId,
        images: ['coucou'],
      } as unknown as Inspection);
      const newState = createdOneImage(state, action);
      expect(newState.inspections[0].images.length).toBe(2);
      expect(newState.inspections[0].images).toContainEqual(action.payload.image.id);
    });

    it('should replace the local image if passed the localId param', () => {
      const state = createEmptyMonkState();
      const localId = 'test';
      state.inspections.push({
        id: action.payload.inspectionId,
        images: [localId],
      } as unknown as Inspection);
      state.images.push({
        id: localId,
        siblingKey: 'test-local-image',
      } as unknown as Image);
      const newState = createdOneImage(state, {
        ...action,
        payload: { ...action.payload, localId },
      });
      expect(newState.inspections[0].images.length).toBe(1);
      expect(newState.inspections[0].images).toContainEqual(action.payload.image.id);
      expect(newState.images.length).toBe(1);
      expect(newState.images).toContainEqual(action.payload.image);
    });

    it('should revoke the object URL if passed the localId param', () => {
      const state = createEmptyMonkState();
      const localId = 'test';
      state.inspections.push({
        id: action.payload.inspectionId,
        images: [localId],
      } as unknown as Inspection);
      const path = 'test-path';
      state.images.push({
        id: localId,
        path,
        siblingKey: 'test-local-image',
      } as unknown as Image);
      createdOneImage(state, {
        ...action,
        payload: { ...action.payload, localId },
      });
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(path);
    });
  });
});
