import { BasePage } from "./BasePage";

export class PhotoCapturePage extends BasePage {
  readonly cameraPreview = this.locator("camera-preview");
  readonly shutterButton = this.locator("take-picture-btn");
  readonly galleryButton = this.locator("monk-gallery-btn");

  async waitForCamera() {
    await this.cameraPreview.waitFor({ state: "visible", timeout: 15_000 });
  }

  async takePicture() {
    await this.shutterButton.waitFor({ state: "visible" });
    await this.shutterButton.click();
  }

  async captureNSights(n: number) {
    await this.waitForCamera();
    for (let i = 0; i < n; i++) {
      await this.takePicture();
      await this.page.waitForTimeout(1_500);
    }
  }

  async captureAllSights() {
    await this.waitForCamera();
    while (await this.shutterButton.isVisible()) {
      await this.takePicture();
      await this.page.waitForTimeout(1_500);
    }
  }
}
