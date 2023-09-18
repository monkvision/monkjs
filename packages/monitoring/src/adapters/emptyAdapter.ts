/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LogContext,
  MonitoringAdapter,
  Severity,
  Transaction,
  TransactionContext,
} from './adapter';

/**
 * Options available when instanciating the Empty Monitoring Adapter.
 */
export interface EmptyAdapterOptions {
  /**
   * Set to `true` to display warnings in the console when an unsupported monitoring function is called.
   *
   * @default true
   */
  showUnsupportedMethodWarnings?: boolean;
}

const defaultOptions: EmptyAdapterOptions = {
  showUnsupportedMethodWarnings: true,
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
 * export class MyCustomMonitoringAdapter extends EmptyMonitoringAdapter {
 *   override log(msg: string): void {
 *     console.log(msg);
 *   }
 *
 *   override handleError(err: Error | string): void {
 *     console.error(err);
 *   }
 * }
 */
export class EmptyMonitoringAdapter implements MonitoringAdapter {
  protected readonly options: Partial<EmptyAdapterOptions>;

  constructor(optionsParam?: Partial<EmptyAdapterOptions>) {
    this.options = {
      ...defaultOptions,
      ...(optionsParam ?? {}),
    };
  }

  setUserId(id: string): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Application users are not supported by the current Monk Monitoring Adapter and calling setUserId will have no effect.',
      );
    }
  }

  log(msg: string, context?: LogContext | Severity): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Logging is not supported by the current Monk Monitoring Adapter and calling log will have no effect.',
      );
    }
  }

  handleError(err: Error | string, context?: Omit<LogContext, 'level'>): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Error handling is not supported by the current Monk Monitoring Adapter and calling handleError will have no effect.',
      );
    }
  }

  createTransaction(context?: TransactionContext): Transaction {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Transactions are not supported by the current Monk Monitoring Adapter and calling createTransaction will have no effect.',
      );
    }
    return {
      id: '',
      setTag: () => {},
      startMeasurement: () => {},
      stopMeasurement: () => {},
      setMeasurementTag: () => {},
      setMeasurement: () => {},
      finish: () => {},
    };
  }
}
