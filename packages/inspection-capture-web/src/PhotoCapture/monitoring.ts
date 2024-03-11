import { Transaction, TransactionContext } from '@monkvision/monitoring';

export const InspectionTransaction = {
  name: 'Inspection',
  operation: 'inspection',
  description: 'Transaction created when the user start a inspection.',
};

export const SightMeasurement = {
  operation: 'inspection.sight',
  description: 'Operation corresponding to the time spent for a sight.',
  sightLabelTagName: 'sight_label',
};

export const SightsTakenMeasurement = {
  name: 'inspection.sights_taken',
};

export const InspectionCompletionMeasurement = {
  name: 'inspection.inspection_completion',
};

export const UploadMeasurement = {
  operation: 'inspection.upload',
  description: 'Operation corresponding to the upload time of a picture image',
  pictureDimensionTagName: 'picture_dimension',
  pictureFormatTagName: 'picture_format',
  pictureModeTagName: 'picture_mode',
};

/**
 * Additional monitoring config that can be provided to the PhotoCapture component.
 */
export type PhotoCaptureMonitoringConfig = Pick<TransactionContext, 'parentId' | 'tags' | 'data'>;

export interface InternalPhotoCaptureMonitoringConfig
  extends Omit<PhotoCaptureMonitoringConfig, 'parentId'> {
  transaction: Transaction | null;
}
