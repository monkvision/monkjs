import * as SentryR from '@sentry/react';
import * as Sentry from 'sentry-expo';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { CaptureConsole } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import { Primitive } from '@sentry/types';
import { Platform } from 'react-native';

import { MonitoringConfigType, MonitoringContextType } from './types';

export * from './types';

const platform = Platform.select({
  web: Sentry.Browser,
  native: Sentry.Browser,
});

/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
*/
export function setTag(key: string, value: Primitive): void {
  SentryR.setTag(key, value);
}

/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
*/
export function setUser(id: string): void {
  SentryR.setUser({ id });
}

/**
 * Monitoring context which will create wrapper for monitoring functionality.
*/
export const MonitoringContext = createContext<MonitoringContextType | null>(null);

/**
 * Monitoring wrapper used to abstract Sentry functionality.
 *
 * @param {object} children - Provider children components that will be shared inside context provider.
 * @param {MonitoringConfig} config - Configuration for sentry to override default configuration.
*/
export function MonitoringProvider({ children, config }: MonitoringConfigType) {
  useEffect(() => {
    Sentry.init({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      dsn: config.dsn,
      environment: config.environment,
      debug: config.debug,
      enableAutoSessionTracking: config.enableAutoSessionTracking,
      enableInExpoDevelopment: config.enableInExpoDevelopment,
      sessionTrackingIntervalMillis: config.sessionTrackingIntervalMillis,
      tracesSampleRate: config.tracesSampleRate,
      integrations: [
        ...(Platform.select({
          web: [new CaptureConsole({ levels: ['log'] })],
          native: [],
        })),
        new Integrations.BrowserTracing({ tracingOrigins: config.tracingOrigins }),
      ],
    } as Sentry.SentryExpoNativeOptions);
  }, []);

  /**
   * Error handler function which is used to capture errors in sentry.
   *
   * @param error {Error | string} - Caught error that to be send to Sentry.io
   */
  const errorHandler = useCallback((error: Error | string): string | null => {
    if (!Sentry || (!Sentry?.Browser && !Sentry?.Native)) { return null; }

    return platform.captureException(error);
  }, []);

  /**
   * Measure the performance of application based on functionality and operation based on it.
   * Return type of the function is the IIFE, which will helps to close the transaction and complete the measurement.
   *
   * @param name {string} - Name of transaction
   * @param operation {string} - Operation of transaction to be performed
   * @param data {{[key: string]: number | string}} - Data to be added on transaction
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  const measurePerformance = useCallback((name: string, operation: string, data?: { [key: string]: number | string }): Function => {
    const transaction = platform.startTransaction({ name, data });
    const transactionOperation = transaction.startChild({ op: operation });

    return () => {
      transactionOperation.finish();
      transaction.finish();
    };
  }, []);

  const monitoringContextValue = useMemo(
    () => ({ errorHandler, measurePerformance }),
    [errorHandler, measurePerformance],
  );

  return (
    <MonitoringContext.Provider value={monitoringContextValue}>
      {children}
    </MonitoringContext.Provider>
  );
}

/**
 * Custom hook which will provide monitoring context which will expose all the functionality.
*/
export function useMonitoring() {
  return useContext(MonitoringContext);
}
