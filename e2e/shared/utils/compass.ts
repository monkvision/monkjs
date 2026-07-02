import type { Page } from "@playwright/test";

export interface WalkaroundOptions {
  /** Alpha value when recording starts (degrees, 0-360). Defaults to 180. */
  startAlpha?: number;
  /** Total degrees to simulate walking. Should exceed 270 to ensure full coverage. Defaults to 370. */
  totalDegrees?: number;
  /** Degrees advanced per event dispatch. Smaller = smoother but slower. Defaults to 5. */
  stepDegrees?: number;
  /**
   * Milliseconds between each event dispatch. Defaults to 210 so that a full 370° walkaround
   * (74 steps × 210ms ≈ 15.5s) satisfies the app's 15-second minimum recording duration.
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
    current = (current - stepDegrees + 360) % 360;
  }
  return alphas;
}

export async function simulateWalkaround(
  page: Page,
  options: WalkaroundOptions = {}
): Promise<void> {
  const startAlpha = options.startAlpha ?? 180;
  const totalDegrees = options.totalDegrees ?? 370;
  const stepDegrees = options.stepDegrees ?? 5;
  const intervalMs = options.intervalMs ?? 210;

  const alphas = buildAlphaSequence(startAlpha, totalDegrees, stepDegrees);

  await page.evaluate(
    ({ alphaValues, delay }: { alphaValues: number[]; delay: number }) =>
      new Promise<void>((resolve) => {
        let index = 0;
        const id = setInterval(() => {
          if (index >= alphaValues.length) {
            clearInterval(id);
            resolve();
            return;
          }
          window.dispatchEvent(
            new DeviceOrientationEvent("deviceorientation", {
              alpha: alphaValues[index],
              beta: 0,
              gamma: 0,
              absolute: false,
            })
          );
          index++;
        }, delay);
      }),
    { alphaValues: alphas, delay: intervalMs }
  );
}
