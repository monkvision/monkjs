import type { Page } from "@playwright/test";

const ORIENTATION_EVENT_TYPES = [
  "deviceorientationabsolute",
  "deviceorientation",
] as const;

export interface WalkaroundOptions {
  /** Alpha value when recording starts (degrees, 0-360). Defaults to 180. */
  startAlpha?: number;
  /** Total degrees to simulate walking. Should exceed 270 to ensure full coverage. Defaults to 370. */
  totalDegrees?: number;
  /** Degrees advanced per event dispatch. Smaller = smoother but slower. Defaults to 5. */
  stepDegrees?: number;
  /**
   * Milliseconds between each event dispatch. Defaults to 540 so that a full 370° walkaround
   * (74 steps × 540ms ≈ 40s) comfortably exceeds the app's 15s minimum recording duration
   * while leaving room for the 270° coverage threshold to be reached.
   */
  intervalMs?: number;
}

function buildAlphaSequence(
  startAlpha: number,
  totalDegrees: number,
  stepDegrees: number
): number[] {
  const alphas: number[] = [];
  let current = startAlpha;
  for (let traveled = 0; traveled <= totalDegrees; traveled += stepDegrees) {
    alphas.push(current);
    current = (current + stepDegrees) % 360;
  }
  return alphas;
}

/**
 * Dispatch a single synthetic DeviceOrientationEvent in the page on every
 * orientation event name the app may listen on. Chromium exposes
 * `ondeviceorientationabsolute`, so `useDeviceOrientation` subscribes to the
 * absolute variant — dispatching both keeps the helper environment-agnostic.
 */
export async function dispatchAlpha(page: Page, alpha: number): Promise<void> {
  await page.evaluate(
    ({
      alphaValue,
      eventTypes,
    }: {
      alphaValue: number;
      eventTypes: readonly string[];
    }) => {
      for (const eventType of eventTypes) {
        window.dispatchEvent(
          new DeviceOrientationEvent(eventType, {
            alpha: alphaValue,
            beta: 0,
            gamma: 0,
            absolute: true,
          })
        );
      }
      // Wait two animation frames so React flushes the setAlpha update and
      // re-memoizes startWalkaround with the primed value before the caller
      // clicks the record button.
      return new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
    },
    { alphaValue: alpha, eventTypes: ORIENTATION_EVENT_TYPES }
  );
}

export async function simulateWalkaround(
  page: Page,
  options: WalkaroundOptions = {}
): Promise<void> {
  const startAlpha = options.startAlpha ?? 180;
  const totalDegrees = options.totalDegrees ?? 370;
  const stepDegrees = options.stepDegrees ?? 5;
  const intervalMs = options.intervalMs ?? 540;

  const alphas = buildAlphaSequence(startAlpha, totalDegrees, stepDegrees);

  await page.evaluate(
    ({
      alphaValues,
      delay,
      eventTypes,
    }: {
      alphaValues: number[];
      delay: number;
      eventTypes: readonly string[];
    }) =>
      new Promise<void>((resolve) => {
        let index = 0;
        const id = setInterval(() => {
          if (index >= alphaValues.length) {
            clearInterval(id);
            resolve();
            return;
          }
          for (const eventType of eventTypes) {
            window.dispatchEvent(
              new DeviceOrientationEvent(eventType, {
                alpha: alphaValues[index],
                beta: 0,
                gamma: 0,
                absolute: true,
              })
            );
          }
          index++;
        }, delay);
      }),
    {
      alphaValues: alphas,
      delay: intervalMs,
      eventTypes: ORIENTATION_EVENT_TYPES,
    }
  );
}
