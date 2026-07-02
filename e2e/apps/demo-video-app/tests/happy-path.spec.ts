import { test, expect } from "../fixtures";

test.describe("demo-video-app happy path", () => {
  test("grants permissions, completes tutorial, records walkaround, captures all sights and submits", async ({
    authenticatedPage,
    permissionsPage,
    tutorialPage,
    videoCapturePage,
    videoCaptureCompletePage,
    photoCapturePage,
    galleryPage,
  }) => {
    await permissionsPage.grantPermissions();

    await tutorialPage.completeTutorial();

    await videoCapturePage.recordWalkaround();

    await videoCaptureCompletePage.confirmAndProceedToPhotoCapture();

    await photoCapturePage.captureAllSights();

    await galleryPage.openFromCapture();
    expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);

    await galleryPage.submit();
  });
});
