import { Primitive } from '@monkvision/types';

/**
 * Severity level of a log element.
 */
export enum Severity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Context provided when logging something.
 */
export interface LogContext {
  level?: Severity;
  extras?: Record<string, unknown>;
  tags?: Record<string, Primitive>;
}

/**
 * Context provided when creating a transaction.
 */
export interface TransactionContext {
  /**
   * The ID of the parent transaction if there is one.
   */
  parentId?: string;
  /**
   * Name of the transaction. This value should be a clear and readable name that is aimed at being displayed in
   * column titles and such.
   */
  name?: string;
  /**
   * Description of the transaction.
   */
  description?: string;
  /**
   * Operation associated to the transaction. This value should be a string ID that represent the kind of operation
   * done in the transaction. This value should follow the following format : 'main_operation.sub_operation' For more
   * details on the semantic conventions, take a look a
   * [this link.](https://github.com/open-telemetry/opentelemetry-specification/blob/24de67b3827a4e3ab2515cd8ab62d5bcf837c586/specification/trace/semantic_conventions/README.md)
   */
  operation?: string;
  /**
   * Trace ID.
   */
  traceId?: string;
  /**
   * Tags of the transaction.
   */
  tags?: Record<string, Primitive>;
  /**
   * Additional data of the transaction.
   */
  data?: Record<string, any>;
}

/**
 * Context provided when creating a measurement in a transaction.
 */
export interface MeasurementContext {
  /**
   * Description of the measurement.
   */
  description?: string;
  /**
   * Additional data of the measurement.
   */
  data?: Record<string, any>;
  /**
   * Tags of the measurement.
   */
  tags?: Record<string, Primitive>;
}

/**
 * Valid unit for a duration measurement.
 */
export type DurationUnit =
  | 'nanosecond'
  | 'microsecond'
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week';

/**
 * Valid unit for a bytes size measurement.
 */
export type InformationUnit =
  | 'bit'
  | 'byte'
  | 'kilobyte'
  | 'kibibyte'
  | 'megabyte'
  | 'mebibyte'
  | 'gigabyte'
  | 'terabyte'
  | 'tebibyte'
  | 'petabyte'
  | 'exabyte'
  | 'exbibyte';

/**
 * Valid unit for a fractions or percentage size measurement.
 */
export type FractionUnit = 'ratio' | 'percent';

/**
 * Unit used for measurement without units (counts...).
 */
export type NoneUnit = '' | 'none';

/**
 * Union type representing the valid units of performance measurements.
 */
export type MeasurementUnit = DurationUnit | InformationUnit | FractionUnit | NoneUnit;

/**
 * The status of a transaction when it is ended.
 */
export enum TransactionStatus {
  /**
   * The operation completed successfully.
   */
  OK = 'ok',
  /**
   * Unknown. Any non-standard HTTP status code.
   */
  UNKNOWN_ERROR = 'unknown_error',
  /**
   * The operation was cancelled (typically by the user).
   */
  CANCELLED = 'cancelled',
  /**
   * The operation was aborted, typically due to a concurrency issue.
   */
  ABORTED = 'aborted',
}

/**
 * A transaction object (used for performance measurement etc.), created using
 * the MonitoringAdapter.createTransaction method.
 */
export interface Transaction {
  /**
   * The ID of the transaction.
   */
  id: string;
  /**
   * Set a tag in the transaction.
   *
   * @param name The name of the tag.
   * @param value The value of the tag.
   */
  setTag: (name: string, value: string) => void;
  /**
   * Start a measurement within the transaction.
   *
   * @param name The name of the measurement. This name will be treated as the identifier of the measurement.
   * @param data Optional data to be sent at the start of measurements.
   */
  startMeasurement: (name: string, context?: MeasurementContext) => void;
  /**
   * Stop (and complete) a measurement that was created using the Transaction.startMeasurement method.
   *
   * @param name The name of the measurement. This name must be the same as the one given to the
   * Transaction.startMeasurement method.
   */
  stopMeasurement: (name: string, status?: TransactionStatus | string) => void;
  /**
   * Add a tag in a measurement that was created using the Transaction.startMeasurement method.
   *
   * @param measurementName The name of the measurement.
   * @param tagName The name of the tag.
   * @param value The value of the tag.
   */
  setMeasurementTag: (measurementName: string, tagName: string, value: string) => void;
  /**
   * Add a custom measurement value to the transaction.
   *
   * @param name The name of the measurement.
   * @param value The value of the measurement.
   * @param unit The unit of the measurement. If no unit is provided, the default unit should be 'none'.
   */
  setMeasurement: (name: string, value: number, unit?: MeasurementUnit) => void;
  /**
   * Finish the transaction.
   *
   * @param status The status of the transaction when completed.
   */
  finish: (status?: TransactionStatus | string) => void;
}

/**
 * Interface describing the requirements for a Monitoring Adapter. An adapter is a tool (such as Sentry etc.) that
 * allow the application to log, report errors and measure performances.
 */
export interface MonitoringAdapter {
  /**
   * Set the ID of the user currently using the application. Ignore this if you have no user system.
   *
   * @param id The ID of the user.
   */
  setUserId: (id: string) => void;
  /**
   * Log a message in the adapter.
   *
   * @param msg The message to log.
   * @param context Optional context that can be sent with the log.
   */
  log: (msg: string, context?: LogContext | Severity) => void;
  /**
   * Handle an error.
   *
   * @param err The error to handle.
   * @param context Optional context that can be sent with the error.
   */
  handleError: (err: unknown, context?: Omit<LogContext, 'level'>) => void;
  /**
   * Create a transaction used for performance measurement.
   *
   * @param context Context of the transaction.
   */
  createTransaction: (context?: TransactionContext) => Transaction;
}
