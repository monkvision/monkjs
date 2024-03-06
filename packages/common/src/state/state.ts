import {
  Damage,
  Image,
  Inspection,
  Part,
  PartOperation,
  RenderedOutput,
  SeverityResult,
  Task,
  Vehicle,
  View,
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
   * The images taken during inspections.
   */
  images: Image[];
  /**
   * The list of inspections currently in the state.
   */
  inspections: Inspection[];
  /**
   * The vehicle parts detected during inspections.
   */
  parts: Part[];
  /**
   * The operations needed to repair damages on inspection vehicle parts.
   */
  partOperations: PartOperation[];
  /**
   * The operations needed to repair damages on inspection vehicle parts.
   */
  renderedOutputs: RenderedOutput[];
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
   * The views created during inspections.
   */
  views: View[];
}

/**
 * Creates an empty state that can be used to initialize the Monk state.
 */
export function createEmptyMonkState(): MonkState {
  return {
    damages: [],
    images: [],
    inspections: [],
    parts: [],
    partOperations: [],
    renderedOutputs: [],
    severityResults: [],
    tasks: [],
    vehicles: [],
    views: [],
  };
}
