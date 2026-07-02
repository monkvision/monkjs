import type { Expect } from "@playwright/test";
import type { GalleryPage } from "../../../shared/pages/GalleryPage";

export interface AssertGalleryUploadsCompleteOptions {
  /** Max allowed non-compliant cards on the approved tab. Defaults to Infinity (no cap). */
  maxNonCompliant?: number;
  /** Max allowed cards on the retake tab. Defaults to 0. */
  maxRetake?: number;
}

/**
 * Asserts upload quality across the two gallery tabs (approved, retake).
 * Takes the spec's expect as a parameter so the rule break is local and visible at the call site.
 */
export async function assertGalleryUploadsComplete(
  galleryPage: GalleryPage,
  expect: Expect,
  options: AssertGalleryUploadsCompleteOptions = {},
): Promise<void> {
  const maxNonCompliant = options.maxNonCompliant ?? Infinity;
  const maxRetake = options.maxRetake ?? 0;

  await galleryPage.clickApprovedFilter();
  await galleryPage.waitForPendingToSettle();
  expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
  const approved = await galleryPage.getTabCardCounts();
  expect(approved.errorCount, "approved tab upload errors").toBe(0);
  expect(
    approved.nonCompliantCount,
    "approved tab non-compliant cards",
  ).toBeLessThanOrEqual(maxNonCompliant);

  await galleryPage.clickRetakeFilter();
  await galleryPage.waitForPendingToSettle();
  expect(
    await galleryPage.imageCards.count(),
    "retake tab card count",
  ).toBeLessThanOrEqual(maxRetake);
}
