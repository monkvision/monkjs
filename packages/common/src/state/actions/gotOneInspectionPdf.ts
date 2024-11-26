import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkGotOneInspectionPdfPayload.
 */
export interface MonkGotOneInspectionPdfPayload {
  /**
   * The ID of the inspection to which the PDF was fetched.
   */
  inspectionId: string;
  /**
   * The URL of the PDF.
   */
  pdfUrl: string;
}

/**
 * Action dispatched when a inspection PDF has been fetched.
 */
export interface MonkGotOneInspectionPdfAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.GOT_ONE_INSPECTION_PDF`.
   */
  type: MonkActionType.GOT_ONE_INSPECTION_PDF;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkGotOneInspectionPdfPayload;
}

/**
 * Matcher function that matches a GotOneInspection while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isGotOneInspectionPdfAction(
  action: MonkAction,
): action is MonkGotOneInspectionPdfAction {
  return action.type === MonkActionType.GOT_ONE_INSPECTION_PDF;
}

/**
 * Reducer function for a GotOneInspection action.
 */
export function gotOneInspectionPdf(
  state: MonkState,
  action: MonkGotOneInspectionPdfAction,
): MonkState {
  const { inspections } = state;
  const { payload } = action;

  const inspection = inspections.find((value) => value.id === payload.inspectionId);
  if (inspection) {
    inspection.pdfUrl = payload.pdfUrl;
  }
  return {
    ...state,
    inspections: [...inspections],
  };
}
