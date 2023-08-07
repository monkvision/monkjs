import {
  Damage,
  Image,
  Inspection,
  Part,
  PartOperation,
  SeverityResult,
  Task,
  Vehicle,
  WheelAnalysis,
} from '@monkvision/types';

/**
 * The React state containing all the Monk entities.
 */
export interface MonkState {
  /**
   * The damages detected in inspections.
   */
  damages: Damage[];
  /**
   * The images of the inspections.
   */
  images: Image[];
  /**
   * The list of inspections currently in the state.
   */
  inspections: Inspection[];
  /**
   * The vehicle parts detected in the inspections.
   */
  parts: Part[];
  /**
   * The operations needed to repair damages on inspection vehicle parts.
   */
  partOperations: PartOperation[];
  /**
   * The details about the severity of the damages on vehicles or veghicle parts in inspections.
   */
  severityResults: SeverityResult[];
  /**
   * The inspection tasks.
   */
  tasks: Task[];
  /**
   * The vehicles inspected in the Monk inspections.
   */
  vehicles: Vehicle[];
  /**
   * The wheel analysis results available in the inspections.
   */
  wheelAnalysis: WheelAnalysis[];
}
