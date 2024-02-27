/**
 * This function creates and returns a new Promise that will resolve to void after the given amount of milliseconds.
 */
export function timeoutPromise(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delayMs);
  });
}
