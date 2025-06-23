import { Primitive } from '@monkvision/types';

/**
 * Interface describing the requirements for an Analytics Adapter. An adapter is a tool (such as Posthog etc.) that
 * allows the application to track events for product analysis.
 */
export interface AnalyticsAdapter {
  /**
   * Set the ID of the user currently using the application. Ignore this if you have no user system.
   *
   * @param id The ID of the user.
   * @param context Optional context of the current user.
   */
  setUserId: (id: string, context?: Record<string, Primitive>) => void;
  /**
   * Set the properties/context of the user currently using the application. Ignore this if you have no user system.
   *
   * @param context context of the current user.
   */
  setUserProperties: (context: Record<string, Primitive>) => void;
  /**
   * Unlink any future events made on that device with that user.
   */
  resetUser: () => void;
  /**
   * Track an event.
   * We recommend using the '[object][verb]' format for your event names, where '[object]' is the entity that the
   * behavior relates to, and '[verb]' is the behavior itself.
   * For example: `Project Created`, `User Signed Up`, or `Invite Sent`.
   *
   * @param name The name of the event.
   * @param context context of the event.
   */
  trackEvent: (name: string, context?: Record<string, Primitive>) => void;
  /**
   * Set properties that will be sent with every `trackEvent` call.
   *
   * @param context context of every event.
   */
  setEventsProperties: (context: Record<string, Primitive>) => void;
  /**
   * Get the ID of the user currently using the application.
   */
  getUserId: () => string;
}
