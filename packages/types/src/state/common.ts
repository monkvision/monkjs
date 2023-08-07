/**
 * The status of a task being run by the Monk backend.
 */
export enum ProgressStatus {
  /**
   * The task has not been started and is not planned to be started yet.
   */
  NOT_STARTED = 'NOT_STARTED',
  /**
   * The task is planned to be started soon by the backend but has not been started yet.
   */
  TODO = 'TODO',
  /**
   * The task is in progress.
   */
  IN_PROGRESS = 'IN_PROGRESS',
  /**
   * The task is complete.
   */
  DONE = 'DONE',
  /**
   * The task was stopped due to an error.
   */
  ERROR = 'ERROR',
  /**
   * The task is done and the result has been validated.
   */
  VALIDATED = 'VALIDATED',
}

/**
 * Enumeration of the levels of severity for a damage.
 */
export enum Severity {
  /**
   * No damage detected.
   */
  NONE = 0,
  /**
   * Low severity damage.
   */
  LOW = 1,
  /**
   * Moderate severity damage.
   */
  MODERATE = 2,
  /**
   * High severity damage.
   */
  HIGH = 3,
}

/**
 * Additional data that can be added to a state entity when creating it.
 */
export type AdditionalData = Record<string, unknown>;
