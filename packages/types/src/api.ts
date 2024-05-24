import { TaskName } from './state';
import { VehicleType } from './sights';

/**
 * Enumeration of the API permissions included in the Monk authentication token.
 *
 * Note that this enum is not extensive and only declares permissions useful for the MonkJs SDK.
 */
export enum MonkApiPermission {
  TASK_COMPLIANCES = 'monk_core_api:compliances',
  TASK_DAMAGE_DETECTION = 'monk_core_api:damage_detection',
  TASK_DAMAGE_IMAGES_OCR = 'monk_core_api:images_ocr',
  TASK_DAMAGE_REPAIR_ESTIMATE = 'monk_core_api:repair_estimate',
  TASK_WHEEL_ANALYSIS = 'monk_core_api:wheel_analysis',
  INSPECTION_CREATE = 'monk_core_api:inspections:create',
  INSPECTION_READ = 'monk_core_api:inspections:read',
  INSPECTION_READ_ALL = 'monk_core_api:inspections:read_all',
  INSPECTION_READ_ORGANIZATION = 'monk_core_api:inspections:read_organization',
  INSPECTION_UPDATE = 'monk_core_api:inspections:update',
  INSPECTION_UPDATE_ALL = 'monk_core_api:inspections:update_all',
  INSPECTION_UPDATE_ORGANIZATION = 'monk_core_api:inspections:update_organization',
  INSPECTION_WRITE = 'monk_core_api:inspections:write',
  INSPECTION_WRITE_ALL = 'monk_core_api:inspections:write_all',
  INSPECTION_WRITE_ORGANIZATION = 'monk_core_api:inspections:write_organization',
}

/**
 * Options used to specify a callback that will be called by the API when a task is complete.
 */
export interface TaskCallbackOptions {
  /**
   * The URL of the callback.
   */
  url: string;
  /**
   * The headers of the request.
   */
  headers: Record<string, string>;
  /**
   * The parameters of the callback.
   */
  params?: Record<string, unknown>;
  /**
   * The event of the callback.
   */
  event?: string;
}

/**
 * Additional options that you can specify when adding the damage detection task to an inspection.
 */
export interface CreateDamageDetectionTaskOptions {
  /**
   * The name of the task : `TaskName.DAMAGE_DETECTION`.
   */
  name: TaskName.DAMAGE_DETECTION;
  /**
   * The confidence threshold between 0 and 1 for the damage detection to be triggered on AI results.
   *
   * @default 0.3
   */
  damageScoreThreshold?: number;
  /**
   * Boolean indicating if, in addition to the prediction outputs, the AI should also generate visual representations
   * of the damages detected. These representations will be available in the payload of the GET /inspections, where
   * the detected damages will be highlighted using polygons on top of the original pictures.
   *
   * @default false
   */
  generateDamageVisualOutput?: boolean;
  /**
   * Boolean indicating if, in addition to the prediction outputs, the AI should also generate cropped images focused
   * on each damage detected.
   *
   * @default true
   */
  generateSubimageDamages?: boolean;
  /**
   * Boolean indicating if, in addition to the prediction outputs, the AI should also generate cropped images focused
   * on each car part detected.
   *
   * @default false
   */
  generateSubimageParts?: boolean;
}

/**
 * Additional options that you can specify when adding the human in the loop task to an inspection.
 */
export interface CreateHinlTaskOptions {
  /**
   * The name of the task : `TaskName.HUMAN_IN_THE_LOOP`.
   */
  name: TaskName.HUMAN_IN_THE_LOOP;
  /**
   * The callbacks called at the end of the Human in the Loop task.
   */
  callbacks?: TaskCallbackOptions[];
}

/**
 * The tasks of the inspection to be created. It is either simply the name of the task to add, or an object with the
 * task name as well as additional configuration options for the task.
 */
export type InspectionCreateTask =
  | TaskName
  | CreateDamageDetectionTaskOptions
  | CreateHinlTaskOptions;

/**
 * Options that can be specified when creating a new inspection.
 */
export interface CreateInspectionOptions {
  /**
   * The tasks to add to the inspection. It is an array of either simply the name of the tasks to add, or an object with
   * the tasks name as well as additional configuration options for the task.
   */
  tasks: InspectionCreateTask[];
  /**
   * Additional details about the vehicle of the inspection (vehicle type, VIN etc.).
   */
  vehicleType?: VehicleType;
  /**
   * Boolean indicating if the API should generate dynamic crops or not.
   *
   * @default true
   */
  useDynamicCrops?: boolean;
}
