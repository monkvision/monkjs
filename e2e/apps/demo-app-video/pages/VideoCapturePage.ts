import { MonkTestId } from "@monkvision/types";
import { BasePage } from "../../../shared/pages/BasePage";
import {
  dispatchAlpha,
  simulateWalkaround,
} from "../../../shared/utils/compass";

const START_ALPHA = 180;

export class VideoCapturePage extends BasePage {
  readonly recordButton = this.locator(MonkTestId.RECORD_VIDEO_BUTTON);
  readonly walkaroundIndicator = this.locator(MonkTestId.WALKAROUND_INDICATOR_CONTAINER);

  async recordWalkaround() {
    await this.walkaroundIndicator.waitFor({
      state: "visible",
      timeout: 15_000,
    });

    await dispatchAlpha(this.page, START_ALPHA);

    await this.page.waitForSelector(
      `[data-testid="${MonkTestId.RECORD_VIDEO_BUTTON}"]:not([disabled])`
    );
    await this.recordButton.click();

    await simulateWalkaround(this.page, {
      startAlpha: START_ALPHA,
      intervalMs: 220, // covers minRecordDuration (10s)
    });

    await this.recordButton.click();
  }
}
