import { AnalyticsAdapter } from '@monkvision/analytics';
import { Primitive } from '@monkvision/types';
import posthog, { PostHog } from 'posthog-js';

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
  /**
   * Name of the Posthog instance used by this adapter. Use a unique name per adapter to send analytics to multiple
   * Posthog projects. Defaults to the global instance, or to a `monk-<token>` instance if the global one already
   * belongs to another project.
   */
  instanceName?: string;
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

  private readonly client: PostHog;

  constructor(optionsParam: PosthogAdapterConfig) {
    this.posthogOptions = {
      ...defaultOptions,
      ...optionsParam,
    };

    this.client = this.initClient();
    this.client.setPersonProperties({
      environnement: this.posthogOptions?.environnement,
      projectName: this.posthogOptions?.projectName,
      release: this.posthogOptions?.release,
    });
  }

  /**
   * Returns the global Posthog instance, or a named one if requested or if the global one is bound to another project.
   */
  private initClient(): PostHog {
    const { token, api_host: apiHost } = this.posthogOptions;
    const isDefaultInstanceUsedByAnotherProject =
      // eslint-disable-next-line no-underscore-dangle
      !!posthog.__loaded && !!posthog.config?.token && posthog.config.token !== token;
    const instanceName =
      this.posthogOptions.instanceName ??
      (isDefaultInstanceUsedByAnotherProject ? `monk-${token}` : undefined);

    if (!instanceName) {
      posthog.init(token, { api_host: apiHost });
      return posthog;
    }
    return posthog.init(token, { api_host: apiHost }, instanceName) ?? posthog;
  }

  setUserId(id: string, context?: Record<string, Primitive>): void {
    this.client.identify(id, context);
  }

  setUserProperties(context: Record<string, Primitive>): void {
    this.client.setPersonProperties(context);
  }

  resetUser(): void {
    this.client.reset();
  }

  trackEvent(name: string, context?: Record<string, Primitive>): void {
    this.client.capture(name, context);
  }

  setEventsProperties(context: Record<string, Primitive>): void {
    this.client.register(context);
  }

  getUserId(): string {
    return this.client.get_distinct_id();
  }
}
