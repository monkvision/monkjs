import { ErrorMessage } from '../sharedTypes/errorMessage';
import { ProgressStatus } from '../sharedTypes/progressStatus';
import { WheelType } from '../wheelAnalysis/entityTypes';

/**
 * Application entity representing an inspection task during an inspection.
 */
export interface Task {
  /**
   * The id (uuid) of the task entity.
   */
  id: string;
  /**
   * The progress status of the task.
   */
  status: ProgressStatus;
  /**
   * The name of the task.
   */
  name: TaskName;
  /**
   * Creation date of the task entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Starting date of the task entity, in the ISO 8601 format.
   */
  startedAt?: string;
  /**
   * Completion date of the task entity, in the ISO 8601 format.
   */
  doneAt?: string;
  /**
   * The confidence score given by the ML algorithm *before* executing the task.
   */
  confidencePreExecution?: boolean;
  /**
   * The progress status of the confidence score evaluation given by the ML algorithm *before* executing the task.
   */
  confidencePreExecutionStatus?: ProgressStatus;
  /**
   * The confidence score given by the ML algorithm *after* executing the task.
   */
  confidencePostExecution?: boolean;
  /**
   * The id (uuid) of the inspection which this task is related to.
   */
  inspectionId?: string;
  /**
   * This images being processed in this task.
   */
  images: ImageInTask[];
  /**
   * The error messages generated if the task failed.
   */
  errorMessages?: ErrorMessage[];
  /**
   * The arguments given to the task when creating / executing it.
   */
  arguments?: unknown;
}

/**
 * Normalized application entity representing an inspection task during an inspection.
 */
export type NormalizedTask = Task;

/**
 * Names of the tasks that can be executed during an inspection.
 *
 * *Swagger Schema Reference :* `TaskName`
 */
export enum TaskName {
  /**
   * Detection of damages on different parts of the car (except the wheels).
   */
  DAMAGE_DETECTION = 'damage_detection',
  /**
   * Inspection of the condition of the wheels.
   */
  WHEEL_ANALYSIS = 'wheel_analysis',
  /**
   * Estimation of the repair operations (and their cost) that has to be done to fix the damages detected by the
   * damage detection task.
   */
  REPAIR_ESTIMATE = 'repair_estimate',
  /**
   * Optical character recognition  : this task is used to automatically "scan" some text like the VIN number for
   * instance.
   */
  IMAGES_OCR = 'images_ocr',
}

/**
 * An image being processed in a task.
 *
 * *Swagger Schema Reference :* `ImageInTask`
 */
export interface ImageInTask {
  /**
   * The id (uuid) of the image entity being processed in the task.
   */
  imageId?: string;
  /**
   * The details of the image relative to the task.
   */
  details?: ImageOCRTaskImageDetails | DamageDetectionTaskImageDetails | WheelAnalysisDetails;
}

/**
 * The details of an image being processed by an OCR task.
 *
 * *Swagger Schema Reference :* `ImageOCRTaskImageDetails`
 */
export interface ImageOCRTaskImageDetails {
  /**
   * The type of element present on the image that is being recognized.
   */
  imageType?: ImageOcrType;
  /**
   * Integer representing the ID of the document.
   */
  documentId?: number;
  /**
   * The details of the location where the text is being analyzed.
   */
  locationDetails?: string;
}

/**
 * The different types of element that can be recognized during an OCR task.
 *
 * *Swagger Schema Reference :* `ImageOcrType`
 */
export enum ImageOcrType {
  /**
   * A passport identifying a person.
   */
  PASSPORT = 'PASSPORT',
  /**
   * A national french id (located on the ID card for instance).
   */
  ID_FR = 'ID_FR',
  /**
   * National french registration papers.
   */
  VEHICLE_REGISTRATION_PAPERS_FR = 'VEHICLE_REGISTRATION_PAPERS_FR',
  /**
   * A vehicle identification number identifying worldwide a vehicle.
   */
  VIN = 'VIN',
}

/**
 * The details of an image being processed by a damage detection task.
 *
 * *Swagger Schema Reference :* `DamageDetectionTaskImageDetails`
 */
export interface DamageDetectionTaskImageDetails {
  /**
   * The name of the view point from where the picture was taken.
   */
  viewpointName?: string;
  /**
   * TODO : Label this field (and define its type ?).
   */
  viewpointDetails?: unknown;
}

/**
 * The details of an image being processed by a wheel analysis task.
 *
 * *Swagger Schema Reference :* `WheelAnalysisDetails`
 */
export interface WheelAnalysisDetails {
  /**
   * The name of the wheel present in the image.
   */
  wheelName?: WheelType;
}
