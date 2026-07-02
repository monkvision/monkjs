import { BasePage } from "../../../shared/pages/BasePage";
import { dispatchAlpha, simulateWalkaround } from "../../../shared/utils/compass";

const START_ALPHA = 180;

export class VideoCapturePage extends BasePage {
  readonly recordButton = this.locator("record-video-button");
  readonly walkaroundIndicator = this.locator("walkaround-indicator-container");

  async recordWalkaround() {
    await this.walkaroundIndicator.waitFor({
      state: "visible",
      timeout: 15_000,
    });

    await dispatchAlpha(this.page, START_ALPHA);

    await this.page.waitForSelector(
      '[data-testid="record-video-button"]:not([disabled])'
    );
    await this.recordButton.click();

    await simulateWalkaround(this.page, { startAlpha: START_ALPHA });

    await this.recordButton.click();
  }
}
