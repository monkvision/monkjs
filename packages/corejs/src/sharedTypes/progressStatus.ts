/**
 * Possible values for a progress status that can be used to represent the status of different objects and entities.
 *
 * Note : This enum is voluntarily different from the InspectionStatus which can only be certain values.
 *
 * *Swagger Schema Reference :* `ProgressStatus`
 */
export enum ProgressStatus {
  /**
   * Indicates that a process has not been started by the server.
   */
  NOT_STARTED = 'NOT_STARTED',
  /**
   * Indicates that a process should soon be started by the server.
   */
  TODO = 'TODO',
  /**
   * Indicates that the server has started the process,
   */
  IN_PROGRESS = 'IN_PROGRESS',
  /**
   * Indicates that the server has successfully completed the process.
   */
  DONE = 'DONE',
  /**
   * Indicates that an error occurred during the process.
   */
  ERROR = 'ERROR',
  /**
   * Indicates that the process has been aborted and did not complete.
   */
  ABORTED = 'ABORTED',
  /**
   * Indicates that the server has successfully completed the process and that a resource is reviewing it.
   */
  IN_REVIEW = 'IN_REVIEW',
  /**
   * Indicates that the server has successfully completed the process and that a resource has validated it.
   */
  VALIDATED = 'VALIDATED',
}

/**
 * Possible values that cna be passed to the API when updating the progress status of an object.
 *
 * *Swagger Schema Reference :* `ProgressStatusPostPatch`
 */
export enum ProgressStatusUpdate {
  /**
   * Indicates that a process has not been started by the server.
   */
  NOT_STARTED = 'NOT_STARTED',
  /**
   * Indicates that a process should soon be started by the server.
   */
  TODO = 'TODO',
  /**
   * Indicates that the server has successfully completed the process.
   */
  DONE = 'DONE',
  /**
   * Indicates that the server has successfully completed the process and that a resource has validated it.
   */
  VALIDATED = 'VALIDATED',
}
