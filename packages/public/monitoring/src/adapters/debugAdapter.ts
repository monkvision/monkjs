import { LogContext, Severity } from './adapter';
import { EmptyAdapterOptions, EmptyMonitoringAdapter } from './emptyAdapter';

const CONSOLE_LOG_FUNCTIONS: { [severity in Severity]: (...data: any[]) => void } = {
  [Severity.DEBUG]: console.debug,
  [Severity.INFO]: console.info,
  [Severity.WARNING]: console.warn,
  [Severity.ERROR]: console.error,
  [Severity.FATAL]: console.error,
};

/**
 * Options available when instanciating the Debug Monitoring Adapter.
 */
export interface DebugAdapterOptions extends EmptyAdapterOptions {}

const defaultOptions: DebugAdapterOptions = {
  showUnsupportedMethodWarnings: true,
};

/**
 * This is a basic Monitoring Adapter that simply logs element in the console. This can be used in your app if you do
 * not have any need for advanced Monitoring Features such as performance measurements. The only methods implemented
 * are `log` and `handleError`, that simply log elements in the console.
 *
 * All the severity levels are implemented and redirected to the corresponding console level except for the fatal level
 * which is redirected to the `console.error` function. The `extras` data passed in the context will also be logged
 * along the message or error, but the tags will be ignored.
 */
export class DebugMonitoringAdapter extends EmptyMonitoringAdapter {
  protected override readonly options: Partial<DebugAdapterOptions>;

  constructor(optionsParam?: Partial<DebugAdapterOptions>) {
    super(optionsParam);
    this.options = {
      ...defaultOptions,
      ...(optionsParam ?? {}),
    };
  }

  override log(msg: string, context?: LogContext | Severity): void {
    const loggingFunction = DebugMonitoringAdapter.getLoggingFunction(context);
    loggingFunction(msg, context);
  }

  override handleError(err: unknown, context?: Omit<LogContext, 'level'>): void {
    const loggingFunction = DebugMonitoringAdapter.getLoggingFunction(Severity.ERROR);
    loggingFunction(err, context);
  }

  private static createLoggingFunction(
    consoleFunction: (...data: any[]) => void,
  ): (msg: unknown, context?: LogContext | Severity) => void {
    return (msg: unknown, context?: LogContext | Severity) => {
      if (typeof context === 'object' && context.extras) {
        return consoleFunction(msg, context.extras);
      }
      return consoleFunction(msg);
    };
  }

  private static getLoggingFunction(
    context?: LogContext | Severity,
  ): (msg: unknown, context?: LogContext | Severity) => void {
    let severity = Severity.INFO;
    if (typeof context === 'string') {
      severity = context;
    } else if (typeof context === 'object' && context.level) {
      severity = context.level;
    }

    return DebugMonitoringAdapter.createLoggingFunction(CONSOLE_LOG_FUNCTIONS[severity]);
  }
}
