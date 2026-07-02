import { test, expect } from "../fixtures";
import {
  completeInspectionSetup,
  completePhotoCaptureJourney,
  submitGallery,
} from "../../../shared/flows";
import { assertGalleryUploadsComplete } from "../flows";
import {
  FAKE_VIDEO_URLS,
  switchFakeCamera,
} from "../../../shared/fixtures/fake-camera.fixture";

// TODO: adjust when real-car photo mock is provided.
// Black-frame camera mock makes every photo non-compliant.
const MAX_NON_COMPLIANT = Infinity;
const MAX_RETAKE = 0;

test.describe("demo-app happy path", () => {
  test("creates inspection, captures all sights, reviews gallery and submits", async ({
    page,
    authenticatedPage,
    createInspectionPage,
    vehicleTypeSelectionPage,
    photoCaptureTutorialPage,
    photoCapturePage,
    galleryPage,
  }) => {
    await test.step("create inspection and select vehicle type", () =>
      completeInspectionSetup(createInspectionPage, vehicleTypeSelectionPage));

    await test.step("switch fake camera for photo capture", () =>
      switchFakeCamera(page, FAKE_VIDEO_URLS.SEDAN_EXTERIOR));

    await test.step("complete photo tutorial and capture all sights", () =>
      completePhotoCaptureJourney(photoCapturePage, {
        tutorialPage: photoCaptureTutorialPage,
      }));

    await test.step("assert gallery tab upload quality", async () => {
      await galleryPage.waitForGallery();
      await assertGalleryUploadsComplete(galleryPage, expect, {
        maxNonCompliant: MAX_NON_COMPLIANT,
        maxRetake: MAX_RETAKE,
      });
    });

    await test.step("submit", () => submitGallery(galleryPage));
  });
});
