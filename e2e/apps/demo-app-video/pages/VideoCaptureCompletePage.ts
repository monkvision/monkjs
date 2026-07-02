import { BasePage } from "../../../shared/pages/BasePage";

export class VideoCaptureCompletePage extends BasePage {
  readonly confirmButton = this.e2eLocator("video-capture-proceed");

  async confirmAndProceedToPhotoCapture() {
    await this.confirmButton.waitFor({ state: "visible", timeout: 30_000 });
    await this.confirmButton.click();
  }
}
