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
   * Should sessions be tracked to Sentry Health or not.
  */
  enableAutoSessionTracking: boolean;
  /**
   * Enable sentry in expo development of not.
  */
  enableInExpoDevelopment: boolean;
  /**
   * The interval to end a session if the App goes to the background.
  */
  sessionTrackingIntervalMillis: number;
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
  tracingOrigins: Array<string>;
}

/**
 * Monitoring context interface
*/
export interface MonitoringContextType {
  /**
   * Store the error in the monitoring application.
  */
  errorHandler: (error: Error | string) => string;

  /**
   * Start Measure Performance
  */
  measurePerformance: (name: string, operation: string, data: { [key: string]: number | string } | null) => void;
}

/**
 * Monitoring configuration interface
*/
export interface MonitoringConfigType {
  /**
   * Provider children components that will be shared inside context provider.
  */
  children: object;

  /**
   * Configuration to initialize Sentry
  */
  config: MonitoringConfig;
}

export const enum MonitoringOperations {
  UPLOAD = 'upload',
  CAMERA = 'camera',
  FUNC = 'func',
  APP = 'app',
  HTTP = 'http',
}

export const SentryTransactionStatus = 'success';

export const enum MonitoringTransaction {
  HTTP = 'http',
  USER_TIME = 'user-time-per-action',
  USER_CAMERA_TIME = 'user-camera-time',
  USER_UPLOAD_CENTER_TIME = 'user-upload-center-time',
  USER_ACTION = 'user-action',
  RESPONSE_TIME = 'response-time',
  FUNC = 'func',
}
