/* eslint-disable @typescript-eslint/no-unused-vars */
import { Primitive } from '@monkvision/types';
import { AnalyticsAdapter } from './adapter';

/**
 * Options available when instanciating the Empty Analytics Adapter.
 */
export interface EmptyAdapterOptions {
  /**
   * Set to `true` to display warnings in the console when an unsupported analytics function is called.
   *
   * @default true
   */
  showUnsupportedMethodWarnings?: boolean;
}

const defaultOptions: EmptyAdapterOptions = {
  showUnsupportedMethodWarnings: true,
};

/**
 * This class is an empty Analytics Adapter, that implements all the methods but does nothing. If you use this adapter
 * in your app, whenever one of its analytics method is invoked, nothing will happen and a warning will be displayed
 * in the console indicating that the specified method is not supported by the current Analytics Adapter (this
 * behaviour can be configured with the options passed in the constructor). Note however that no error will be either
 * displayed or thrown by this adapter : your app will continue to work normally.
 *
 * When creating your own Analytics Adapter, you can extend this class if you do not plan on implementing all the
 * features of the Monk Analytics.
 *
 * @example
 * export class MyCustomAnalyticsAdapter extends EmptyAnalyticsAdapter {
 *   override setUserId(id: string, context?: Record<string, Primitive>): void {
 *      // custom settings
 *   }
 *
 *   override trackEvent(name: string, context?: Record<string, Primitive> ): void {
 *      // custom settings
 *   }
 * }
 */
export class EmptyAnalyticsAdapter implements AnalyticsAdapter {
  protected readonly options: Partial<EmptyAdapterOptions>;

  constructor(optionsParam?: Partial<EmptyAdapterOptions>) {
    this.options = {
      ...defaultOptions,
      ...(optionsParam ?? {}),
    };
  }

  setUserId(id: string, context?: Record<string, Primitive>): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Application users are not supported by the current Monk Analytics Adapter and calling setUserId will have no effect.',
      );
    }
  }

  setUserProperties(context: Record<string, Primitive>): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Application users are not supported by the current Monk Analytics Adapter and calling setUserProperties will have no effect.',
      );
    }
  }

  resetUser(): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Application users are not supported by the current Monk Analytics Adapter and calling resetUser will have no effect.',
      );
    }
  }

  trackEvent(name: string, context?: Record<string, Primitive>): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Events are not supported by the current Monk Analytics Adapter and calling trackEvent will have no effect.',
      );
    }
  }

  setEventsProperties(context?: Record<string, Primitive>): void {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Events are not supported by the current Monk Analytics Adapter and calling setEventsProperties will have no effect.',
      );
    }
  }

  getUserId(): string {
    if (this.options.showUnsupportedMethodWarnings) {
      console.warn(
        'Application users are not supported by the current Monk Analytics Adapter and calling getUserId will have no effect.',
      );
    }

    return '[UserId]';
  }
}
