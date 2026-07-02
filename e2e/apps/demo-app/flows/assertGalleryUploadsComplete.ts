import type { Expect } from "@playwright/test";
import type { GalleryPage } from "../../../shared/pages/GalleryPage";

export interface AssertGalleryUploadsCompleteOptions {
  /** Max allowed non-compliant cards on the approved tab.
   *
   * @default Infinity
   */
  maxNonCompliant?: number;
}

/**
 * Asserts non-compliant or upload errors.
 */
export async function assertGalleryUploadsComplete(
  galleryPage: GalleryPage,
  expect: Expect,
  options: AssertGalleryUploadsCompleteOptions = {}
): Promise<void> {
  const maxNonCompliant = options.maxNonCompliant ?? Infinity;

  await galleryPage.waitForPendingToSettle();
  expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
  const approved = await galleryPage.getTabCardCounts();
  expect(approved.errorCount, "approved tab upload errors").toBe(0);
  expect(
    approved.nonCompliantCount,
    "approved tab non-compliant cards"
  ).toBeLessThanOrEqual(maxNonCompliant);
}
