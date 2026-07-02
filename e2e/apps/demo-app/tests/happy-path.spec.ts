import { test } from "../fixtures";
import {
  completeInspectionSetup,
  completePhotoCaptureJourney,
} from "../../../shared/flows";
import { assertGalleryUploadsComplete, submitAndAwaitReport } from "../flows";
import {
  FAKE_VIDEO_URLS,
  switchFakeCamera,
} from "../../../shared/fixtures/fake-camera.fixture";
import { expect } from "@playwright/test";

test.describe("demo-app happy path", () => {
  test("creates inspection, captures all sights, reviews gallery and submits", async ({
    page,
    authenticatedPage,
    createInspectionPage,
    vehicleTypeSelectionPage,
    photoCaptureTutorialPage,
    photoCapturePage,
    galleryPage,
    damageReportPage,
  }) => {
    test.setTimeout(45_000);

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
        maxNonCompliant: 0,
      });
    });

    await test.step("submit", () =>
      submitAndAwaitReport(galleryPage, damageReportPage));
  });
});
