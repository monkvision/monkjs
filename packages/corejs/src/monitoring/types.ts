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
  measurePerformance: (name: string, op: string, data: { [key: string]: number | string } | null) => (() => void);

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

export const SentryTransactionStatus = 'success';
