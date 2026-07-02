import { MonkTestId } from "@monkvision/types";
import { BasePage } from "../../../shared/pages/BasePage";

export class CaptureSelectionPage extends BasePage {
  readonly captureButton = this.locator(MonkTestId.CAPTURE_BTN);

  async goToPhotoCapture() {
    await this.captureButton.waitFor({ state: "visible", timeout: 10_000 });
    await this.captureButton.click();
  }
}
