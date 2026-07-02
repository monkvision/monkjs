import { MonkE2eId, MonkTestId } from "@monkvision/types";
import { BasePage } from "./BasePage";

export interface TabCardCounts {
  pendingCount: number;
  successCount: number;
  nonCompliantCount: number;
  errorCount: number;
  videoCount: number;
}

export class GalleryPage extends BasePage {
  readonly galleryButton = this.locator(MonkTestId.MONK_GALLERY_BTN);
  readonly submitButton = this.e2eLocator(MonkE2eId.GALLERY_SUBMIT);
  readonly imageCards = this.locator(MonkTestId.CARD_BTN);

  readonly manualFilterPill = this.e2eLocator(MonkE2eId.GALLERY_FILTER_MANUAL);
  readonly beautyShotsFilterPill = this.e2eLocator(MonkE2eId.GALLERY_FILTER_BEAUTY_SHOTS);
  readonly videoFilterPill = this.e2eLocator(MonkE2eId.GALLERY_FILTER_VIDEO);
  readonly approvedFilterPill = this.e2eLocator(MonkE2eId.GALLERY_FILTER_APPROVED);
  readonly retakeFilterPill = this.e2eLocator(MonkE2eId.GALLERY_FILTER_RETAKE);

  readonly pendingCards = this.e2eLocator(MonkE2eId.GALLERY_CARD_PENDING);
  readonly successCards = this.e2eLocator(MonkE2eId.GALLERY_CARD_SUCCESS);
  readonly nonCompliantCards = this.e2eLocator(MonkE2eId.GALLERY_CARD_NON_COMPLIANT);
  readonly errorCards = this.e2eLocator(MonkE2eId.GALLERY_CARD_ERROR);
  readonly videoCards = this.e2eLocator(MonkE2eId.GALLERY_CARD_VIDEO);

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

  async clickApprovedFilter() {
    await this.approvedFilterPill.click();
  }

  async clickRetakeFilter() {
    await this.retakeFilterPill.click();
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

  async submit(timeout?: number) {
    await this.page.waitForSelector(
      `[data-e2e="${MonkE2eId.GALLERY_SUBMIT}"]:not([disabled])`,
      { timeout }
    );
    await this.submitButton.click();
  }
}
