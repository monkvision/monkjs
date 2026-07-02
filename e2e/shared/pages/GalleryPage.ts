import { BasePage } from "./BasePage";

export class GalleryPage extends BasePage {
  readonly galleryButton = this.locator("monk-gallery-btn");
  readonly submitButton = this.e2eLocator("gallery-submit");
  readonly imageCards = this.locator("card-btn");

  /** Use when the gallery button is still visible (mid-capture manual navigation). */
  async openFromCapture() {
    await this.galleryButton.click();
  }

  /** Use when the app auto-navigates to the gallery (e.g. after all sights are captured). */
  async waitForGallery(timeout = 15_000) {
    await this.submitButton.waitFor({ state: "visible", timeout });
  }

  async submit() {
    await this.page.waitForSelector(
      '[data-e2e="gallery-submit"]:not([disabled])'
    );
    await this.submitButton.click();
  }
}
