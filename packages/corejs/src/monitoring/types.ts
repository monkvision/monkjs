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
  Ok = 'ok',
  /** Deadline expired before operation could complete. */
  DeadlineExceeded = 'deadline_exceeded',
  /** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */
  Unauthenticated = 'unauthenticated',
  /** 403 Forbidden */
  PermissionDenied = 'permission_denied',
  /** 404 Not Found. Some requested entity (file or directory) was not found. */
  NotFound = 'not_found',
  /** 429 Too Many Requests */
  ResourceExhausted = 'resource_exhausted',
  /** Client specified an invalid argument. 4xx. */
  InvalidArgument = 'invalid_argument',
  /** 501 Not Implemented */
  Unimplemented = 'unimplemented',
  /** 503 Service Unavailable */
  Unavailable = 'unavailable',
  /** Other/generic 5xx. */
  InternalError = 'internal_error',
  /** Unknown. Any non-standard HTTP status code. */
  UnknownError = 'unknown_error',
  /** The operation was cancelled (typically by the user). */
  Cancelled = 'cancelled',
  /** Already exists (409) */
  AlreadyExists = 'already_exists',
  /** Operation was rejected because the system is not in a state required for the operation's */
  FailedPrecondition = 'failed_precondition',
  /** The operation was aborted, typically due to a concurrency issue. */
  Aborted = 'aborted',
  /** Operation was attempted past the valid range. */
  OutOfRange = 'out_of_range',
  /** Unrecoverable data loss or corruption */
  DataLoss = 'data_loss',
}

export const SentryConst = {
  TRANSACTION: {
    pictureProcessing: 'Picture Processing',
  },
  OPERATION: {
    images_ocr: 'Image OCR',
    damage_detection: 'Damage Detection',
    captureTour: 'Capture Tour',
    captureSight: 'Capture Sight',
  },
  SPAN: {
    takePic: 'Take Pic',
    createThumbnail: 'Create Thumbnail',
    uploadPic: 'Upload Pic',
  },
  TAG: {
    inspectionId: 'inspectionId',
    sightId: 'sightId',
    task: 'task',
    isSkip: 'isSkip',
    isRetake: 'isRetake',
    takenPictures: 'takenPictures',
    retakenPictures: 'retakenPictures',
    percentOfNonCompliancePics: 'percentOfNonCompliancePics',
  },
};
