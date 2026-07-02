import type { Expect } from "@playwright/test";
import type { GalleryPage } from "../pages/GalleryPage";

export interface AssertGalleryUploadsCompleteOptions {
  /** Max allowed non-compliant cards on the manual tab. Defaults to Infinity (no cap). */
  maxManualNonCompliant?: number;
  /** Max allowed non-compliant cards on the beauty-shots tab. Defaults to Infinity (no cap). */
  maxBeautyNonCompliant?: number;
}

/**
 * Asserts that uploads completed cleanly across the three gallery tabs (manual,
 * beauty shots, video). The beauty-shots tab is allowed to be empty when no
 * viewpoint candidates are produced. The video tab's non-compliant count is
 * intentionally not asserted since video frames are tagged regardless of
 * compliance.
 *
 * This is the one flow that contains expect() — it takes the spec's expect as
 * a parameter so the rule break is local and visible at the call site.
 */
export async function assertGalleryUploadsComplete(
  galleryPage: GalleryPage,
  expect: Expect,
  options: AssertGalleryUploadsCompleteOptions = {},
): Promise<void> {
  const maxManualNonCompliant = options.maxManualNonCompliant ?? Infinity;
  const maxBeautyNonCompliant = options.maxBeautyNonCompliant ?? Infinity;

  await galleryPage.waitForPendingToSettle();
  expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
  const manual = await galleryPage.getTabCardCounts();
  expect(manual.errorCount, "manual tab upload errors").toBe(0);
  expect(
    manual.nonCompliantCount,
    "manual tab non-compliant cards",
  ).toBeLessThanOrEqual(maxManualNonCompliant);

  await galleryPage.clickBeautyShotsFilter();
  const beautyShotCount = await galleryPage.imageCards.count();
  if (beautyShotCount > 0) {
    await galleryPage.waitForPendingToSettle();
    const beauty = await galleryPage.getTabCardCounts();
    expect(beauty.errorCount, "beauty tab upload errors").toBe(0);
    expect(
      beauty.nonCompliantCount,
      "beauty tab non-compliant cards",
    ).toBeLessThanOrEqual(maxBeautyNonCompliant);
  }

  await galleryPage.clickVideoFilter();
  expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
  await galleryPage.waitForPendingToSettle();
  const video = await galleryPage.getTabCardCounts();
  expect(video.errorCount, "video tab upload errors").toBe(0);
}
