/**
 * Primitive JavaScript type used in monitoring tags.
 */
export type Primitive = number | string | boolean | bigint | symbol | null | undefined;

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
  extras?: { [key: string]: unknown };
  tags?: { [key: string]: Primitive };
}

/**
 * Context provided when creating a transaction.
 */
export interface TransactionContext {
  /**
   * Name of the transaction.
   */
  name?: string;
  /**
   * Description of the transaction.
   */
  description?: string;
  /**
   * Operation associated to the transaction.
   */
  operation?: string;
  /**
   * Trace ID.
   */
  traceId?: string;
  /**
   * Tags of the transaction.
   */
  tags?: {
    [key: string]: Primitive;
  };
  /**
   * Data of the transaction.
   */
  data?: {
    [key: string]: any;
  };
}

/**
 * A transaction object (used for performance measurement etc.), created using
 * the MonitoringAdapter.createTransaction method.
 */
export interface Transaction {
  /**
   * Set a tag in the transaction.
   * @param name The name of the tag.
   * @param value The value of the tag.
   */
  setTag: (name: string, value: string) => void;
  /**
   * Start a measurement.
   * @param name The name of the measurement. This name will be treated as the identifier of the measurement.
   */
  startMeasurement: (name: string) => void;
  /**
   * Stop (and complete) a measurement that was created using the Transaction.startMeasurement method.
   * @param name The name of the measurement. This name must be the same as the one given to the
   * Transaction.startMeasurement method.
   */
  stopMeasurement: (name: string) => void;
  /**
   * Finish the transaction.
   * @param status The status of the transaction when completed.
   */
  finish: (status?: string) => void;
}

/**
 * Interface describing the requirements for a Monitoring Adapter. An adapter is a tool (such as Sentry etc.) that
 * allow the application to log, report errors and measure performances.
 */
export interface MonitoringAdapter {
  /**
   * Set the ID of the user currently using the application. Ignore this if you have no user system.
   * @param id The ID of the user.
   */
  setUserId: (id: string) => void;
  /**
   * Log a message in the adapter.
   * @param msg The message to log.
   * @param context Optional context that can be sent with the log.
   */
  log: (msg: string, context?: LogContext | Severity) => void;
  /**
   * Handle an error.
   * @param err The error to handle.
   * @param context Optional context that can be sent with the error.
   */
  handleError: (err: Error | string, context?: Omit<LogContext, 'level'>) => void;
  /**
   * Create a transaction used for performance measurement.
   * @param context Context of the transaction.
   */
  createTransaction: (context: TransactionContext) => Transaction;
}
