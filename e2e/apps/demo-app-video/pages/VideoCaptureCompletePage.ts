import { MonkE2eId } from "@monkvision/types";
import { BasePage } from "../../../shared/pages/BasePage";

export class VideoCaptureCompletePage extends BasePage {
  readonly confirmButton = this.e2eLocator(MonkE2eId.VIDEO_CAPTURE_PROCEED);

  async confirmAndProceedToPhotoCapture() {
    await this.confirmButton.waitFor({ state: "visible", timeout: 30_000 });
    await this.confirmButton.click();
  }
}
