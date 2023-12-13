import { LabelPrediction } from './common';

/**
 * Enumeration of the vehicle wheels.
 */
export enum WheelName {
  /**
   * The front left wheel.
   */
  FRONT_LEFT = 'wheel_front_left',
  /**
   * The front right wheel.
   */
  FRONT_RIGHT = 'wheel_front_right',
  /**
   * The back left wheel.
   */
  BACK_LEFT = 'wheel_back_left',
  /**
   * The back right wheel.
   */
  BACK_RIGHT = 'wheel_back_right',
}

/**
 * The information about a wheel that has been computed from an image.
 */
export interface WheelAnalysis {
  /**
   * The ID of the inspection associated with this wheel analysis result.
   */
  inspectionId: string;
  /**
   * The condition of the rim.
   */
  rimCondition: LabelPrediction;
  /**
   * The material of the rim.
   */
  rimMaterial: LabelPrediction;
  /**
   * The visual aspect of the rim.
   */
  rimVisualAspect: LabelPrediction;
  /**
   * Label indicating if there is a hubcap over the rim or not.
   */
  hubcapOverRim: LabelPrediction;
  /**
   * The condition of the hubcap (only applicable if there is a hubcap).
   */
  hubcapCondition: LabelPrediction;
  /**
   * The visual aspect of the hubcap (only applicable if there is a hubcap).
   */
  hubcapVisualAspect: LabelPrediction;
  /**
   * The ID of the image on which the wheel analysis was performed.
   */
  imageId?: string;
  /**
   * The name of the wheel analysed.
   */
  wheelName?: WheelName;
}
