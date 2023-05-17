/**
 * Monitoring config interface
*/
export interface MonitoringConfig {
  /**
   * DSN key for sentry.io application
  */
  dsn: string;
  /**
   * The current environment of your application (e.g. "production")
  */
  environment: string;
  /**
   * Enable debug functionality in the SDK itself
  */
  debug: boolean;
  /**
   * Release version of current application
  */
  release: string;
  /**
   * Sample rate to determine trace sampling.
   *
   * 0.0 = 0% chance of a given trace being sent (send no traces) 1.0 = 100% chance of a given trace being sent (send
   * all traces)
   *
   * Tracing is enabled if either this or `tracesSampler` is defined. If both are defined, `tracesSampleRate` is
   * ignored.
  */
  tracesSampleRate: number;
  /**
   * Array of all the origin to browser trace.
  */
  tracingOrigins: string[];
  /**
   * Custom tags to add in all transaction.
  */
  customTags?: { [tag: string]: string };
}

/**
 * Sentry transaction object interface
 */
export interface SentryTransactionObject {
  /**
   * Set tag in a transaction instance
   */
  setTag: (name: string, value: string) => void;

  /**
   * Create a span in a transaction instance to measure the performance for a sub event
   */
  startSpan: (op: string, data: { [key: string]: number | string } | null) => void;

  /**
   * Finish a running span in a transaction instance and complete the measurement for a sub event
   */
  finishSpan: (op: string) => void;

  /**
   * Finish a running transaction instance and complete the measurement for a main event
   */
  finish: (status: string) => void;
}

/**
 * Monitoring context interface
*/
export interface MonitoringContext {
  /**
   * Set current user for sentry.
  */
  setMonitoringUser: (id: string) => void;

  /**
   * Store the error in the monitoring application.
  */
  errorHandler: (error: Error | string) => string;

  /**
   * Start Measure Performance
  */
  measurePerformance: (name: string, op: string, data: { [key: string]: number | string } | null) => SentryTransactionObject;

  /**
   * Set custom measurement value
  */
  setMeasurement: (transactionName: string, name: string, value: number, unit: string) => void;
}

/**
 * Monitoring configuration interface
*/
export interface MonitoringProps {
  /**
   * Configuration to initialize Sentry
  */
  config: MonitoringConfig;
}

/**
 * The status of an Transaction/Span.
 */
export enum MonitoringStatus {
  /** The operation completed successfully. */
  OK = 'ok',
  /** Unknown. Any non-standard HTTP status code. */
  UNKNOWN_ERROR = 'unknown_error',
  /** The operation was cancelled (typically by the user). */
  CANCELLED = 'cancelled',
  /** The operation was aborted, typically due to a concurrency issue. */
  ABORTED = 'aborted',
}

/**
 * The name of entities in Sentry
 */
export enum SentryTransaction {
  PICTURE_PROCESSING = 'Picture Processing',
}

export enum SentryOperation {
  IMAGES_OCR = 'Image OCR',
  DAMAGE_DETECTION = 'Damage Detection',
  ADD_DAMAGE = 'Add Damage',
  CAPTURE_TOUR = 'Capture Tour',
  CAPTURE_SIGHT = 'Capture Sight',
}

export enum SentrySpan {
  TAKE_PIC = 'Take Pic',
  CREATE_THUMBNAIL = 'Create Thumbnail',
  UPLOAD_PIC = 'Upload Pic',
}

export enum SentryTag {
  INSPECTION_ID = 'inspectionId',
  SIGHT_ID = 'sightId',
  TASK = 'task',
  IS_SKIP = 'isSkip',
  IS_RETAKE = 'isRetake',
  TAKEN_PICTURES = 'takenPictures',
  RETAKEN_PICTURES = 'retakenPictures',
  ADD_DAMAGES = 'addDamages',
  PERCENT_OF_NON_COMPLIANCE_PICS = 'percentOfNonCompliancePics',
}
