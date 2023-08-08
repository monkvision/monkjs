/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LogContext,
  MonitoringAdapter,
  Severity,
  Transaction,
  TransactionContext,
} from '@monkvision/monitoring';

import * as Sentry from '@sentry/react';
import { Span } from '@sentry/types';

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
 * Options available when instantiating the Sentry Monitoring Adapter.
 */
export interface SentryMonitoringOptions {
  /**
   * DSN key for sentry.io application
   *
   * @default ""
   */
  dsn: string;
  /**
   * The current environment of your application (e.g. "production")
   *
   * @default ""
   */
  environment: string;
  /**
   * Enable debug functionality in the SDK itself
   *
   * @default false
   */
  debug: boolean;
  /**
   * Release version of current application
   *
   * @default ""
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
   *
   * @default 0.025
   */
  tracesSampleRate: number;
  /**
   * Array of all the origin to browser trace.
   *
   * @default []
   */
  tracingOrigins: string[];
  /**
   * Custom tags to add in all transaction.
   *
   */
  customTags?: { [tag: string]: string };
}

const defaultOptions: SentryMonitoringOptions = {
  dsn: '',
  environment: '',
  debug: false,
  tracesSampleRate: 0.025,
  release: '',
  tracingOrigins: [],
};

/**
 * This class is an empty Monitoring Adapter, that implements all the methods but does nothing. If you use this adapter
 * in your app, whenever one of its monitoring method is invoked, nothing will happen and a warning will be displayed
 * in the console indicating that the specified method is not supported by the current Monitoring Adapter (this
 * behaviour can be configured with the options passed in the constructor). Note however that no error will be either
 * displayed or thrown by this adapter : your app will continue to work normally and dummy instances will be created and
 * return for things like Transactions.
 *
 * When creating your own Monitoring Adapter, you can extend this class if you do not plan on implementing all the
 * features of the Monk Monitoring.
 *
 * @example
 * export class MyCustomMonitoringAdapter extends SentryMonitoringAdapter {
 *   override log(msg: string): void {
 *     console.log(msg);
 *   }
 *
 *   override handleError(err: Error | string): void {
 *     console.error(err);
 *   }
 * }
 */
export class SentryMonitoringAdapter implements MonitoringAdapter {
  constructor(optionsParam: Partial<SentryMonitoringOptions>) {
    Sentry.init({
      dsn: optionsParam.dsn || '',
      environment: optionsParam.environment ?? 'local',
      debug: optionsParam.debug ?? true,
      release: optionsParam.release ?? '1.0',
      tracesSampleRate: optionsParam.tracesSampleRate ?? 0.025,
      beforeBreadcrumb(breadcrumb, hint) {
        if (breadcrumb.category === 'xhr') {
          return null;
        }

        return breadcrumb;
      },
    });

    if (optionsParam.customTags) {
      Sentry.setTags(optionsParam.customTags);
    }
  }

  setUserId(id: string): void {
    Sentry.setUser({ id });
  }

  log(msg: string, context?: LogContext | Severity): void {
    Sentry.captureMessage(msg, context);
  }

  handleError(err: Error | string, context?: Omit<LogContext, 'level'>): void {
    Sentry.captureException(err, context);
  }

  createTransaction(context: TransactionContext): Transaction {
    // Create a new sentry transaction
    const transaction = Sentry.startTransaction({
      name: context.name || '',
      data: context.data || {},
      op: context.operation || '',
      description: context.description || '',
      traceId: context.traceId || '',
      tags: context.tags || {},
      sampled: true,
    });
    console.log('🚀 ~ SentryMonitoringAdapter ~ createTransaction ~ transaction:', transaction);

    // Create an object to map spans for a transaction
    const transactionSpansObj: { [key: string]: any } = {};

    return {
      setTag: (tagName: string, tagValue: string) => transaction.setTag(tagName, tagValue),
      startMeasurement: (name: string, data?: { [key: string]: number | string }) => {
        transactionSpansObj[name] = transaction.startChild({
          op: name,
          data: data || {},
        });
      },
      stopMeasurement: () => (name: string) => {
        if (transactionSpansObj[name]) {
          const spanObj: Span = transactionSpansObj[name] as Span;
          spanObj.setStatus(MonitoringStatus.OK);
          spanObj.finish();
          delete transactionSpansObj[name];
        }
      },
      finish: (status: string = MonitoringStatus.OK) => {
        transaction.setStatus(status);
        transaction.finish();
      },
    };
  }
}
