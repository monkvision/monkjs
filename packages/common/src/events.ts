/**
 * A generic handler function for a Monk event.
 */
export type HandlerFn = (...args: never) => unknown;

/**
 * A general type definition for a set of Monk event handlers. A set of handlers is an object containing handler
 * functions for different events dispatched by Monk components.
 *
 * *This type is an abstract type that is not meant to be used directly, but rather
 * extended by actual event managers.*
 *
 * @example
 * export interface CaptureEventHandlers extends MonkEventHandlers {
 *   onPictureTaken?: (picture: Picture) => unknown,
 * }
 */
export type MonkEventHandlers = Record<string, HandlerFn>;

/**
 * Merge multiple event handlers into one single object. The handler functions will all be called, in the order
 * specified by the handlers list.
 *
 * @param handlersList The list of handlers to merge together.
 */
export function mergeEventHandlers<T extends MonkEventHandlers>(handlersList: T[]): T {
  const handlers = {} as T;

  handlersList.forEach((eventHandlers) => {
    Object.entries(eventHandlers).forEach(([key, value]) => {
      const handlerFn = value as HandlerFn;
      if (handlerFn) {
        const event = key as keyof T;
        const previousHandler = handlers[event];
        handlers[event] = ((...args: never) => {
          const callbackArgs = [...args];
          if (previousHandler) {
            previousHandler(...callbackArgs);
          }
          handlerFn(...callbackArgs);
        }) as T[keyof T];
      }
    });
  });

  return handlers;
}
