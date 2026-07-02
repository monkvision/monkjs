import { BasePage } from "./BasePage";

export interface TabCardCounts {
  pendingCount: number;
  successCount: number;
  nonCompliantCount: number;
  errorCount: number;
  videoCount: number;
}

export class GalleryPage extends BasePage {
  readonly galleryButton = this.locator("monk-gallery-btn");
  readonly submitButton = this.e2eLocator("gallery-submit");
  readonly imageCards = this.locator("card-btn");

  readonly manualFilterPill = this.e2eLocator("gallery-filter-manual");
  readonly beautyShotsFilterPill = this.e2eLocator(
    "gallery-filter-beauty-shots"
  );
  readonly videoFilterPill = this.e2eLocator("gallery-filter-video");

  readonly pendingCards = this.e2eLocator("gallery-card-pending");
  readonly successCards = this.e2eLocator("gallery-card-success");
  readonly nonCompliantCards = this.e2eLocator("gallery-card-non-compliant");
  readonly errorCards = this.e2eLocator("gallery-card-error");
  readonly videoCards = this.e2eLocator("gallery-card-video");

  /** Use when the gallery button is still visible (mid-capture manual navigation). */
  async openFromCapture() {
    await this.galleryButton.click();
  }

  /** Use when the app auto-navigates to the gallery (e.g. after all sights are captured). */
  async waitForGallery(timeout = 15_000) {
    await this.submitButton.waitFor({ state: "visible", timeout });
  }

  async clickManualFilter() {
    await this.manualFilterPill.click();
  }

  async clickBeautyShotsFilter() {
    await this.beautyShotsFilterPill.click();
  }

  async clickVideoFilter() {
    await this.videoFilterPill.click();
  }

  /** Waits for all cards in the active tab to leave the pending state. */
  async waitForPendingToSettle(timeout = 60_000) {
    await this.pendingCards.waitFor({ state: "hidden", timeout });
  }

  /** Snapshot of card counts in the currently active tab. Pair with waitForPendingToSettle first. */
  async getTabCardCounts(): Promise<TabCardCounts> {
    const [
      pendingCount,
      successCount,
      nonCompliantCount,
      errorCount,
      videoCount,
    ] = await Promise.all([
      this.pendingCards.count(),
      this.successCards.count(),
      this.nonCompliantCards.count(),
      this.errorCards.count(),
      this.videoCards.count(),
    ]);
    return {
      pendingCount,
      successCount,
      nonCompliantCount,
      errorCount,
      videoCount,
    };
  }

  async submit() {
    await this.page.waitForSelector(
      '[data-e2e="gallery-submit"]:not([disabled])'
    );
    await this.submitButton.click();
  }
}
