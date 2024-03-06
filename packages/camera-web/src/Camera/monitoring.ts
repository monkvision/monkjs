import { Transaction, TransactionContext } from '@monkvision/monitoring';

export const TakePictureTransaction = {
  name: 'Take Picture',
  operation: 'take_picture',
  description:
    'Transaction created when the Camera component takes a picture. It includes video preview screenshot, compression etc.',
};

export const ScreenshotMeasurement = {
  operation: 'take_picture.screenshot',
  description: 'Operation corresponding to the screenshot of the Camera component video stream',
  outputResolutionTagName: 'output_resolution',
};

export const CompressionMeasurement = {
  operation: 'take_picture.compression',
  description:
    'Operation corresponding to the compression of a picture taken by the Camera component.',
  formatTagName: 'format',
  qualityTagName: 'quality',
  dimensionsTagName: 'dimensions',
};

export const ScreenshotSizeMeasurement = {
  name: 'take_picture.screenshot_size',
};

export const PictureSizeMeasurement = {
  name: 'take_picture.picture_size',
};

export const CompressionSizeRatioMeasurement = {
  name: 'take_picture.compression_size_ratio',
};

/**
 * Additional monitoring config that can be provided to the Camera component.
 */
export type CameraMonitoringConfig = Pick<TransactionContext, 'parentId' | 'tags' | 'data'>;

export interface InternalCameraMonitoringConfig extends Omit<CameraMonitoringConfig, 'parentId'> {
  transaction: Transaction | null;
}
