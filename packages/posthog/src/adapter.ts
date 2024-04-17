import { AnalyticsAdapter } from '@monkvision/analytics';
import { Primitive } from '@monkvision/types';
import posthog from 'posthog-js';

/**
 * Config required when instantiating the Posthog Analytics Adapter.
 */
export interface PosthogConfig {
  /**
   * Token key for Posthog application.
   */
  token: string;
  /**
   * The URL of the Posthog application.
   *
   * @default 'local'
   */
  api_host: string;
  /**
   * The environment of your application (e.g. "production").
   *
   * @default 'local'
   */
  environnement: string;
  /**
   * The project name or client.
   *
   * @default 'monkjs'
   */
  projectName: string;
  /**
   * Release version of application.
   *
   * @default '1.0.0'
   */
  release: string;
}

/**
 * Type definition for the config options given to the PosthogAnalyticsAdapter constructor.
 */
export interface PosthogAdapterConfig extends Partial<PosthogConfig> {
  /**
   * Token key for Posthog application.
   */
  token: string;
}

const defaultOptions: Omit<PosthogConfig, 'token'> = {
  api_host: 'https://eu.posthog.com',
  environnement: 'local',
  projectName: 'monkjs',
  release: '1.0.0',
};

/**
 * This is a Analytics Adapter that connects the app to the Posthog platform.
 * There are four methods implemented which are `setUserId`, `setUserProperties`, `resetUser` and `trackEvent`,
 *
 * When initializing the adapter, the user have to pass required Posthog configuration keys to make connection between
 * the application and Posthog. The `trackEvent` method will log the event in the Posthog dashboards.
 */
export class PosthogAnalyticsAdapter implements AnalyticsAdapter {
  private readonly posthogOptions: PosthogConfig;

  constructor(optionsParam: PosthogAdapterConfig) {
    this.posthogOptions = {
      ...defaultOptions,
      ...optionsParam,
    };

    posthog.init(this.posthogOptions.token, {
      api_host: this.posthogOptions.api_host,
    });
    posthog.setPersonProperties({
      environnement: this.posthogOptions?.environnement,
      projectName: this.posthogOptions?.projectName,
      release: this.posthogOptions?.release,
    });
  }

  setUserId(id: string, context?: Record<string, Primitive>): void {
    posthog.identify(id, context);
  }

  setUserProperties(context: Record<string, Primitive>): void {
    posthog.setPersonProperties(context);
  }

  resetUser(): void {
    posthog.reset();
  }

  trackEvent(name: string, context?: Record<string, Primitive>): void {
    posthog.capture(name, context);
  }

  setEventsProperties(context: Record<string, Primitive>): void {
    posthog.register(context);
  }
}
