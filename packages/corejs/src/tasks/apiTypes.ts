import {
  CoreJsResponse,
  CoreJsResponseWithId,
  IdResponse,
  ProgressStatusUpdate,
  ReponseWithInspectionId,
} from '../sharedTypes';
import { Task } from './entityTypes';

/**
 * The type returned byt the getOneTask method.
 */
export type GetOneTaskResponse = CoreJsResponseWithId<Task, string, 'id'> & ReponseWithInspectionId;

/**
 * The details of the tasks of an inspection.
 *
 * *Swagger Schema Reference :* `Tasks`
 */
export interface InspectionTasks {
  /**
   * The details of the damage detection task of this inspection if it has one.
   */
  damageDetection?: Task;
  /**
   * The details of the wheel analysis task of this inspection if it has one.
   */
  wheelAnalysis?: Task;
  /**
   * The details of the repair estimate task of this inspection if it has one.
   */
  repairEstimate?: Task;
  /**
   * The details of the image OCR task of this inspection if it has one.
   */
  imageOcr?: Task;
}

/**
 * The type returned byt the getManyTasks method.
 */
export type GetManyTasksResponse = CoreJsResponse<InspectionTasks, string[]> & ReponseWithInspectionId;

/**
 * The information given to update the state of a task.
 *
 * *Swagger Schema Reference :* `TaskPatch`
 */
export interface UpdateTask {
  /**
   * Updates the status of the task.
   */
  status?: ProgressStatusUpdate;
  /**
   * Updates the arguments of the task.
   */
  arguments?: unknown;
}

/**
 * The details of a task returned after updating it.
 */
export type UpdatedTask = Pick<Task, 'id' | 'name' | 'status' | 'arguments'>;

/**
 * The type returned byt the getManyTasks method.
 */
export type UpdateOneTaskResponse = CoreJsResponseWithId<IdResponse<'id'>, string, 'id'> & ReponseWithInspectionId;
