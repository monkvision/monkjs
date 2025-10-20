import { Damage, Image, Inspection, Part, RenderedOutput, View } from '@monkvision/types';
import {
  createEmptyMonkState,
  deletedOneImage,
  isDeletedOneImageAction,
  MonkActionType,
  MonkDeletedOneImageAction,
} from '../../../src';

const action: MonkDeletedOneImageAction = {
  type: MonkActionType.DELETED_ONE_IMAGE,
  payload: {
    inspectionId: 'inspections-test',
    imageId: 'image-id-test',
  },
};

describe('DeletedOneImage action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isDeletedOneImageAction({ type: MonkActionType.DELETED_ONE_IMAGE })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isDeletedOneImageAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(deletedOneImage(state, action), state)).toBe(false);
    });

    it('should delete image in the state', () => {
      const state = createEmptyMonkState();
      const outputId = 'rendered-output-id-test';
      const damageId = 'damage-id-test';
      const partId = 'part-id-test';
      const viewId = 'view-id-test';
      state.inspections.push({
        id: action.payload.inspectionId,
        images: [action.payload.imageId] as string[],
      } as Inspection);
      state.images.push({
        id: action.payload.imageId,
        inspectionId: action.payload.inspectionId,
        views: [viewId],
        renderedOutputs: [outputId],
      } as Image);
      state.damages.push({
        id: damageId,
        relatedImages: [action.payload.imageId],
        inspectionId: action.payload.inspectionId,
      } as Damage);
      state.parts.push({
        id: partId,
        relatedImages: [action.payload.imageId],
        inspectionId: action.payload.inspectionId,
      } as Part);
      state.renderedOutputs.push({
        id: outputId,
        baseImageId: action.payload.imageId,
      } as RenderedOutput);
      state.views.push({
        id: viewId,
        renderedOutputs: [outputId],
      } as View);
      const newState = deletedOneImage(state, action);
      const inspectionImages = newState.inspections.find(
        (ins) => ins.id === action.payload.inspectionId,
      )?.images;

      expect(inspectionImages?.length).toBe(0);
      expect(inspectionImages).not.toContainEqual(action.payload.imageId);
      expect(newState.images.length).toBe(0);
      expect(newState.damages.length).toBe(1);
      expect(newState.parts.length).toBe(1);
      expect(newState.views.length).toBe(1);
      expect(
        newState.damages.find((damage) => damage.relatedImages.includes(action.payload.imageId)),
      ).toBeUndefined();
      expect(
        newState.parts.find((part) => part.relatedImages.includes(action.payload.imageId)),
      ).toBeUndefined();
      expect(newState.renderedOutputs.length).toBe(0);
      expect(
        newState.renderedOutputs.find((output) => output.baseImageId === action.payload.imageId),
      ).toBeUndefined();
      expect(
        newState.views.find((view) =>
          view.renderedOutputs.find((id) => id === action.payload.imageId),
        ),
      ).toBeUndefined();
    });
  });
});
