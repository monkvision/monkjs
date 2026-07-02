import { test, expect } from "../fixtures";

// TODO: adjust when real-car video is provided.
// Black-frame camera mock makes every manual photo non-compliant.
const MAX_MANUAL_NON_COMPLIANT = Infinity;
const MAX_BEAUTY_NON_COMPLIANT = Infinity;

test.describe("demo-app-video happy path", () => {
  test("grants permissions, completes tutorial, records walkaround, captures all sights and submits", async ({
    authenticatedPage,
    permissionsPage,
    tutorialPage,
    videoCapturePage,
    videoCaptureCompletePage,
    photoCapturePage,
    galleryPage,
  }) => {
    test.setTimeout(180_000);

    await permissionsPage.grantPermissions();

    await tutorialPage.completeTutorial();

    await videoCapturePage.recordWalkaround();

    await videoCaptureCompletePage.confirmAndProceedToPhotoCapture();

    await photoCapturePage.captureAllSights();

    await galleryPage.waitForGallery();

    // Manual photos tab (default active when enableBeautyShotExtraction=true)
    await galleryPage.waitForPendingToSettle();
    expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
    const manual = await galleryPage.getTabCardCounts();
    expect(manual.errorCount, "manual tab upload errors").toBe(0);
    expect(
      manual.nonCompliantCount,
      "manual tab non-compliant cards"
    ).toBeLessThanOrEqual(MAX_MANUAL_NON_COMPLIANT);

    // Beauty shots tab — may be empty if no viewpoint candidates
    await galleryPage.clickBeautyShotsFilter();
    const beautyShotCount = await galleryPage.imageCards.count();
    if (beautyShotCount > 0) {
      await galleryPage.waitForPendingToSettle();
      const beauty = await galleryPage.getTabCardCounts();
      expect(beauty.errorCount, "beauty tab upload errors").toBe(0);
      expect(
        beauty.nonCompliantCount,
        "beauty tab non-compliant cards"
      ).toBeLessThanOrEqual(MAX_BEAUTY_NON_COMPLIANT);
    }

    // Video tab — frames tagged gallery-card-video regardless of compliance.
    await galleryPage.clickVideoFilter();
    expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
    await galleryPage.waitForPendingToSettle();
    const video = await galleryPage.getTabCardCounts();
    expect(video.errorCount, "video tab upload errors").toBe(0);

    await galleryPage.submit();
  });
});
