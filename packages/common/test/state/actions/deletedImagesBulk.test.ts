import { Damage, Image, Inspection, Part, RenderedOutput, View } from '@monkvision/types';
import {
  createEmptyMonkState,
  deletedImagesBulk,
  isDeletedImagesBulkAction,
  MonkActionType,
  MonkDeletedImagesBulkAction,
} from '../../../src';

const action: MonkDeletedImagesBulkAction = {
  type: MonkActionType.DELETED_IMAGES_BULK,
  payload: {
    inspectionId: 'inspections-test',
    imageIds: ['image-id-1', 'image-id-2'],
  },
};

describe('DeletedImagesBulk action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isDeletedImagesBulkAction({ type: MonkActionType.DELETED_IMAGES_BULK })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isDeletedImagesBulkAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(deletedImagesBulk(state, action), state)).toBe(false);
    });

    it('should delete all specified images from the state', () => {
      const state = createEmptyMonkState();
      const outputId1 = 'rendered-output-id-1';
      const outputId2 = 'rendered-output-id-2';
      const damageId = 'damage-id-test';
      const partId = 'part-id-test';
      const viewId1 = 'view-id-1';
      const viewId2 = 'view-id-2';
      state.inspections.push({
        id: action.payload.inspectionId,
        images: ['image-id-1', 'image-id-2', 'image-id-3'] as string[],
      } as Inspection);
      state.images.push(
        {
          id: 'image-id-1',
          inspectionId: action.payload.inspectionId,
          views: [viewId1],
          renderedOutputs: [outputId1],
        } as Image,
        {
          id: 'image-id-2',
          inspectionId: action.payload.inspectionId,
          views: [viewId2],
          renderedOutputs: [outputId2],
        } as Image,
        {
          id: 'image-id-3',
          inspectionId: action.payload.inspectionId,
          views: [],
          renderedOutputs: [],
        } as Image,
      );
      state.damages.push({
        id: damageId,
        relatedImages: ['image-id-1', 'image-id-2', 'image-id-3'],
        inspectionId: action.payload.inspectionId,
      } as Damage);
      state.parts.push({
        id: partId,
        relatedImages: ['image-id-1', 'image-id-2', 'image-id-3'],
        inspectionId: action.payload.inspectionId,
      } as Part);
      state.renderedOutputs.push(
        { id: outputId1, baseImageId: 'image-id-1' } as RenderedOutput,
        { id: outputId2, baseImageId: 'image-id-2' } as RenderedOutput,
      );
      state.views.push(
        { id: viewId1, renderedOutputs: [outputId1] } as View,
        { id: viewId2, renderedOutputs: [outputId2] } as View,
      );

      const newState = deletedImagesBulk(state, action);
      const inspectionImages = newState.inspections.find(
        (ins) => ins.id === action.payload.inspectionId,
      )?.images;

      expect(inspectionImages).toEqual(['image-id-3']);
      expect(newState.images.length).toBe(1);
      expect(newState.images[0].id).toBe('image-id-3');
      expect(newState.damages[0].relatedImages).toEqual(['image-id-3']);
      expect(newState.parts[0].relatedImages).toEqual(['image-id-3']);
      expect(newState.renderedOutputs.length).toBe(0);
      expect(newState.views[0].renderedOutputs.length).toBe(0);
      expect(newState.views[1].renderedOutputs.length).toBe(0);
    });

    it('should handle empty imageIds array', () => {
      const state = createEmptyMonkState();
      state.images.push({
        id: 'image-id-1',
        inspectionId: 'inspections-test',
        views: [],
        renderedOutputs: [],
      } as Image);
      const emptyAction: MonkDeletedImagesBulkAction = {
        type: MonkActionType.DELETED_IMAGES_BULK,
        payload: { inspectionId: 'inspections-test', imageIds: [] },
      };
      const newState = deletedImagesBulk(state, emptyAction);
      expect(newState.images.length).toBe(1);
    });

    it('should handle missing inspection gracefully', () => {
      const state = createEmptyMonkState();
      state.images.push({
        id: 'image-id-1',
        inspectionId: 'inspections-test',
        views: [],
        renderedOutputs: [],
      } as Image);
      const newState = deletedImagesBulk(state, action);
      expect(newState.images.length).toBe(0);
    });
  });
});
