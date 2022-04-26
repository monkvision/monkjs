/**
 * Application entity representing an analysis of a car wheel during an inspection.
 */
export interface WheelAnalysis {
  /**
   * The id (uuid) of the wheel analysis entity.
   */
  id: string;
  /**
   * The condition of the rim of the wheel.
   */
  rimCondition?: LabelPrediction;
  /**
   * The condition of the material of the wheel rim.
   */
  rimMaterial?: LabelPrediction;
  /**
   * The condition of the hubcap over rim of the wheel.
   */
  hubcapOverRim?: LabelPrediction;
  /**
   * The condition of the wheel rim visual aspect.
   */
  rimVisualAspect?: LabelPrediction;
  /**
   * The condition of the hubcap of the wheel.
   */
  hubcapCondition?: LabelPrediction;
  /**
   * The condition of the visual aspect of the wheel hubcap.
   */
  hubcapVisualAspect?: LabelPrediction;
  /**
   * The type of wheel.
   */
  wheelName?: WheelType;
  /**
   * TODO : Label this field (and define its type ?).
   */
  bbox?: unknown;
}

/**
 * Normalized application entity representing an analysis of a car wheel during an inspection.
 */
export type NormalizedWheelAnalysis = WheelAnalysis;

/**
 * A prediction of a wheel part condition.
 */
export interface LabelPrediction {
  /**
   * The prediction of the condition.
   */
  prediction: string;
  /**
   * The confidence that the ML algorithm have in its prediction.
   */
  confidence: number;
}

/**
 * The four wheels of a car.s
 *
 * *Swagger Schema Reference :* `WheelType`
 */
export enum WheelType {
  /**
   * The front left wheel.
   */
  WHEEL_FRONT_LEFT = 'wheel_front_left',
  /**
   * The front right wheel.
   */
  WHEEL_FRONT_RIGHT = 'wheel_front_right',
  /**
   * The back left wheel.
   */
  WHEEL_BACK_LEFT = 'wheel_back_left',
  /**
   * The front right wheel.
   */
  WHEEL_BACK_RIGHT = 'wheel_back_right',
}
