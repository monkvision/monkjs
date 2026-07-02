import { BasePage } from "../../../shared/pages/BasePage";
import { simulateWalkaround } from "../../../shared/utils/compass";

const START_ALPHA = 180;

export class VideoCapturePage extends BasePage {
  readonly recordButton = this.locator("record-video-button");
  readonly walkaroundIndicator = this.locator("walkaround-indicator-container");

  async recordWalkaround() {
    await this.walkaroundIndicator.waitFor({
      state: "visible",
      timeout: 15_000,
    });

    // Prime the compass with the initial alpha before starting recording,
    await this.page.evaluate((alpha: number) => {
      window.dispatchEvent(
        new DeviceOrientationEvent("deviceorientation", {
          alpha,
          beta: 0,
          gamma: 0,
          absolute: false,
        })
      );
    }, START_ALPHA);

    await this.page.waitForSelector(
      '[data-testid="record-video-button"]:not([disabled])'
    );
    await this.recordButton.click();

    // Simulate 370° walkaround at 210ms/step (≈15.5s), satisfying both the
    await simulateWalkaround(this.page, { startAlpha: START_ALPHA });

    await this.recordButton.click();
  }
}
