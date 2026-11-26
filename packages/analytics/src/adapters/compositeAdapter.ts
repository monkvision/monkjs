import { Primitive } from '@monkvision/types';
import { AnalyticsAdapter } from './adapter';

/**
 * An Analytics Adapter that forwards every call to a list of adapters, to send analytics to multiple platforms or
 * projects at once. The first adapter is the primary one, used to return values (e.g. `getUserId`). If an adapter
 * throws, the remaining ones are still called and the first error is re-thrown afterwards.
 *
 * @example
 * const adapter = new CompositeAnalyticsAdapter([primaryAdapter, secondaryAdapter]);
 * adapter.trackEvent('Project Created'); // Sent to both adapters.
 */
export class CompositeAnalyticsAdapter implements AnalyticsAdapter {
  protected readonly adapters: AnalyticsAdapter[];

  constructor(adapters: AnalyticsAdapter[]) {
    if (adapters.length === 0) {
      throw new Error('CompositeAnalyticsAdapter requires at least one Analytics Adapter.');
    }
    this.adapters = [...adapters];
  }

  setUserId(id: string, context?: Record<string, Primitive>): void {
    this.forEachAdapter((adapter) => adapter.setUserId(id, context));
  }

  setUserProperties(context: Record<string, Primitive>): void {
    this.forEachAdapter((adapter) => adapter.setUserProperties(context));
  }

  resetUser(): void {
    this.forEachAdapter((adapter) => adapter.resetUser());
  }

  trackEvent(name: string, context?: Record<string, Primitive>): void {
    this.forEachAdapter((adapter) => adapter.trackEvent(name, context));
  }

  setEventsProperties(context: Record<string, Primitive>): void {
    this.forEachAdapter((adapter) => adapter.setEventsProperties(context));
  }

  getUserId(): string {
    return this.adapters[0].getUserId();
  }

  private forEachAdapter(callback: (adapter: AnalyticsAdapter) => void): void {
    let firstError: unknown;
    let hasError = false;
    this.adapters.forEach((adapter) => {
      try {
        callback(adapter);
      } catch (err) {
        if (!hasError) {
          hasError = true;
          firstError = err;
        }
      }
    });
    if (hasError) {
      throw firstError;
    }
  }
}
