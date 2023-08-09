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
export enum SentryTransactionStatus {
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
 * Config required when instantiating the Sentry Monitoring Adapter.
 */
export interface SentryConfig {
  /**
   * DSN key for sentry.io application.
   */
  dsn: string;
  /**
   * The environment of your application (e.g. "production").
   *
   * @default 'local'
   */
  environment: string;
  /**
   * Enable debug functionality in the SDK itself.
   *
   * @default false
   */
  debug: boolean;
  /**
   * Release version of application.
   *
   * @default '''
   */
  release: string;
  /**
   * Sample rate to determine trace sampling.
   *
   * 0.0 = 0% chance of a given trace being sent (send no traces) 1.0 = 100% chance of a given trace being sent (send
   * all traces).
   * 
   * @default 0.025
   */
  tracesSampleRate: number;
  /**
   * Custom tags to add in all transaction.
   */
  customTags?: { [tag: string]: string };
}

/**
 * Type definition for the config options given to the SentryMonitoringAdapter constructor.
 */
export interface SentryAdapterConfig extends Partial<SentryConfig> {
  /*
   * DSN key for sentry.io application.
   */
  dsn: string;
}

const defaultOptions: Omit<SentryConfig, 'dsn'> = {
  environment: 'local',
  debug: false,
  tracesSampleRate: 0.025,
  release: '',
};

/**
 * This is a Sentry Monitoring Adapter that logs element in the Sentry.
 * There are four methods implemented which are `setUserId`, `log`, `handleError` and `createTransaction`,
 *
 * At the initialization level, user have to pass required sentry configuration keys to make connection between
 * application and Sentry. `log` and `handleError` methods will log data and errors respectively in the Sentry dashboards.
 * While `createTransaction` method used to measure a performance of an application at any given point.
 */
export class SentryMonitoringAdapter implements MonitoringAdapter {
  private readonly options: SentryConfig;

  constructor(optionsParam: SentryAdapterConfig) {
    this.options = {
      ...defaultOptions,
      ...(optionsParam ?? {}),
    };

    Sentry.init({
      ...this.options,
      beforeBreadcrumb: (breadcrumb, hint) => (breadcrumb.category === 'xhr' ? null : breadcrumb),
    });

    if (this.options.customTags) {
      Sentry.setTags(this.options.customTags);
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
    const transaction = Sentry.startTransaction({
      name: context.name ?? '',
      data: context.data ?? {},
      op: context.operation ?? '',
      description: context.description ?? '',
      traceId: context.traceId ?? '',
      tags: context.tags ?? {},
      sampled: true,
    });

    // Create an object to map spans for a transaction.
    const transactionSpans: Record<string, Span> = {};

    return {
      setTag: (tagName: string, tagValue: string) => transaction.setTag(tagName, tagValue),
      startMeasurement: (name: string, data?: Record<string, number | string>) => {
        transactionSpans[name] = transaction.startChild({
          op: name,
          data: data ?? {},
        });
      },
      stopMeasurement: () => (name: string) => {
        if (transactionSpans[name]) {
          transactionSpans[name].setStatus(SentryTransactionStatus.OK);
          transactionSpans[name].finish();
          delete transactionSpans[name];
        }
      },
      finish: (status: string = SentryTransactionStatus.OK) => {
        transaction.setStatus(status);
        transaction.finish();
      },
    };
  }
}
