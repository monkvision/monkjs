import * as Sentry from '@sentry/react';
import { Span, Scope } from '@sentry/types';
import {
  DebugMonitoringAdapter,
  LogContext,
  MeasurementUnit,
  MonitoringAdapter,
  LogSeverity,
  Transaction,
  TransactionContext,
  MeasurementContext,
  TransactionStatus,
} from '@monkvision/monitoring';
import { Primitive } from '@monkvision/types';

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
   * @default ''
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

function getScopeFn(context?: Omit<LogContext, 'level'>): (scope: Scope) => Scope {
  return (scope: Scope) => {
    if (context?.tags) {
      scope.setTags(context.tags);
    }
    if (context?.extras) {
      scope.setContext('extras', context.extras);
    }
    return scope;
  };
}

function getLogContext(
  context?: LogContext | LogSeverity,
): ((scope: Scope) => Scope) | LogSeverity | undefined {
  if (!context || typeof context === 'string') {
    return context;
  }
  return getScopeFn(context);
}

/**
 * This is a Monitoring Adapter that connects the app to the Sentry platform.
 * There are four methods implemented which are `setUserId`, `log`, `handleError` and `createTransaction`,
 *
 * When initializing the adapter, the user have to pass required sentry configuration keys to make connection between
 * the application and Sentry. The `log` and `handleError` methods will log data and errors respectively in the Sentry
 * dashboards, as well as log them in the console. The `createTransaction` method used to measure performances in an
 * application at any given point.
 */
export class SentryMonitoringAdapter extends DebugMonitoringAdapter implements MonitoringAdapter {
  private readonly sentryOptions: SentryConfig;

  constructor(optionsParam: SentryAdapterConfig) {
    super();
    this.sentryOptions = {
      ...defaultOptions,
      ...optionsParam,
    };

    Sentry.addTracingExtensions();
    Sentry.init({
      ...this.sentryOptions,
      beforeBreadcrumb: (breadcrumb) => (breadcrumb.category === 'xhr' ? null : breadcrumb),
    });

    if (this.sentryOptions.customTags) {
      Sentry.setTags(this.sentryOptions.customTags);
    }
  }

  override setUserId(id: string): void {
    console.log('Hello');
    Sentry.setUser({ id });
  }

  override log(msg: string, context?: LogContext | LogSeverity): void {
    super.log(msg, context);
    Sentry.captureMessage(msg, getLogContext(context));
  }

  override handleError(err: unknown, context?: Omit<LogContext, 'level'>): void {
    super.handleError(err, context);
    Sentry.captureException(err, getScopeFn(context));
  }

  override createTransaction(context?: TransactionContext): Transaction {
    const transaction = Sentry.startTransaction({
      parentSpanId: context?.parentId,
      name: context?.name ?? '',
      data: context?.data ?? {},
      op: context?.operation ?? '',
      description: context?.description ?? '',
      traceId: context?.traceId ?? '',
      tags: context?.tags ?? {},
      sampled: true,
    });
    const transactionSpans: Record<string, Span> = {};

    return {
      id: transaction.spanId,
      setTag: (tagName: string, tagValue: string) => transaction.setTag(tagName, tagValue),
      startMeasurement: (name: string, measurementContext?: MeasurementContext) => {
        transactionSpans[name] = transaction.startChild({
          ...(measurementContext ?? {}),
          op: name,
        });
      },
      stopMeasurement: (
        name: string,
        status: TransactionStatus | string = TransactionStatus.OK,
      ) => {
        if (!transactionSpans[name]) {
          this.handleError(
            new Error(
              `Unable to stop measurement in SentryMonitoringAdapter : Unknown measurement name "${name}"`,
            ),
          );
          return;
        }
        transactionSpans[name].setStatus(status);
        transactionSpans[name].finish();
        delete transactionSpans[name];
      },
      setMeasurementTag: (measurementName: string, tagName: string, value: string) => {
        if (!transactionSpans[measurementName]) {
          this.handleError(
            new Error(
              `Unable to set tag to measurement in SentryMonitoringAdapter : Unknown measurement name "${measurementName}"`,
            ),
          );
          return;
        }
        transactionSpans[measurementName].setTag(tagName, value);
      },
      setMeasurement: (name: string, value: number, unit: MeasurementUnit = 'none') => {
        transaction.setMeasurement(name, value, unit);
      },
      finish: (status: TransactionStatus | string = TransactionStatus.OK) => {
        transaction.setStatus(status);
        transaction.finish();
      },
    };
  }

  override setTags(tags: Record<string, Primitive>): void {
    Sentry.setTags(tags);
  }
}
