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
 * Enumeration of the levels of severity for a damage or a part.
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
 * A label output resulting from a model prediction.
 */
export interface LabelPrediction {
  /**
   * The label resulting from the model prediction.
   */
  prediction: string;
  /**
   * The confidence score given to this label by the model when doing its prediction. It goes from 0 (low confidence) to
   * 1 (high confidence). The value can be -1 in the case of an error or no computation done.
   */
  confidence: number;
}

/**
 * Enumeration of the possible currency symbols used in the Monk state.
 */
export enum CurrencyCode {
  /**
   * Euro
   */
  EUR = 'EUR',
  /**
   * United-States Dollar
   */
  USD = 'USD',
  /**
   * British Pound
   */
  GBP = 'GBP',
  /**
   * Swiss Franc
   */
  CHF = 'CHF',
  /**
   * Australian Dollar
   */
  AUD = 'AUD',
}

export enum CurrencySymbol {
  /**
   * Euro
   */
  EUR = '€',
  /**
   * United-States Dollar
   */
  USD = '$',
  /**
   * British Pound
   */
  GBP = '£',
  /**
   * Swiss Franc
   */
  CHF = 'CHF',
  /**
   * Australian Dollar
   */
  AUD = 'A$',
}

/**
 * Additional data that can be added to a state entity when creating it.
 */
export type AdditionalData = Record<string, unknown>;
