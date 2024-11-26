import {
  createEmptyMonkState,
  MonkActionType,
  isGotOneInspectionPdfAction,
  gotOneInspectionPdf,
  MonkGotOneInspectionPdfAction,
} from '../../../src';
import { Inspection } from '@monkvision/types';

const action: MonkGotOneInspectionPdfAction = {
  type: MonkActionType.GOT_ONE_INSPECTION_PDF,
  payload: {
    inspectionId: 'inspections-test-111111',
    pdfUrl: 'pdf-url-test',
  },
};

describe('gotOneInspectionPdf action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isGotOneInspectionPdfAction({ type: MonkActionType.GOT_ONE_INSPECTION_PDF })).toBe(
        true,
      );
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isGotOneInspectionPdfAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(gotOneInspectionPdf(state, action), state)).toBe(false);
    });

    it('should update inspection in the state', () => {
      const state = createEmptyMonkState();
      state.inspections.push({
        id: 'inspections-test-111111',
      } as Inspection);
      const newState = gotOneInspectionPdf(state, action);
      expect(newState.inspections).toContainEqual({
        id: action.payload.inspectionId,
        pdfUrl: action.payload.pdfUrl,
      });
    });
  });
});
