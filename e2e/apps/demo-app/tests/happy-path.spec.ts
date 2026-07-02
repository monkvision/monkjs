import { test, expect } from "../fixtures";
import {
  completeInspectionSetup,
  completePhotoCaptureJourney,
  submitGallery,
} from "../../../shared/flows";

test.describe("demo-app happy path", () => {
  test("creates inspection, captures all sights, reviews gallery and submits", async ({
    authenticatedPage,
    createInspectionPage,
    vehicleTypeSelectionPage,
    photoCaptureTutorialPage,
    photoCapturePage,
    galleryPage,
  }) => {
    await test.step("create inspection and select vehicle type", () =>
      completeInspectionSetup(createInspectionPage, vehicleTypeSelectionPage));

    await test.step("complete photo tutorial and capture all sights", () =>
      completePhotoCaptureJourney(photoCapturePage, {
        tutorialPage: photoCaptureTutorialPage,
      }));

    await test.step("review gallery and submit", async () => {
      await galleryPage.waitForGallery();
      expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
      await submitGallery(galleryPage);
    });
  });
});
