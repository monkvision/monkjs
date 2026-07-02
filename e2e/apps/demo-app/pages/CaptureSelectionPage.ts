import { BasePage } from "../../../shared/pages/BasePage";

export class CaptureSelectionPage extends BasePage {
  readonly captureButton = this.locator("capture-btn");

  async goToPhotoCapture() {
    await this.captureButton.waitFor({ state: "visible", timeout: 10_000 });
    await this.captureButton.click();
  }
}
