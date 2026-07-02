import { expect } from "@playwright/test";
import { test } from "../fixtures";
import {
  completeVideoWalkaroundFlow,
  completePhotoCaptureJourney,
  submitGallery,
} from "../../../shared/flows";
import { assertGalleryUploadsComplete } from "../flows";
import {
  switchFakeCamera,
  FAKE_VIDEO_URLS,
} from "../../../shared/fixtures/fake-camera.fixture";

const MAX_MANUAL_NON_COMPLIANT = 0;
const MAX_BEAUTY_NON_COMPLIANT = 0;

test.describe("demo-app-video happy path", () => {
  test("grants permissions, completes tutorial, records walkaround, captures all sights and submits", async ({
    page,
    authenticatedPage,
    permissionsPage,
    tutorialPage,
    videoCapturePage,
    videoCaptureCompletePage,
    photoCapturePage,
    galleryPage,
  }) => {
    test.setTimeout(120_000);

    await test.step("grant permissions, complete tutorial, record walkaround", () =>
      completeVideoWalkaroundFlow({
        permissionsPage,
        tutorialPage,
        videoCapturePage,
        videoCaptureCompletePage,
      }));

    await test.step("switch fake camera for photo capture", () =>
      switchFakeCamera(page, FAKE_VIDEO_URLS.SEDAN_INTERIOR));

    await test.step("capture all manual photo sights", () =>
      completePhotoCaptureJourney(photoCapturePage));

    await test.step("assert gallery tab upload quality", async () => {
      await galleryPage.waitForGallery();
      await assertGalleryUploadsComplete(galleryPage, expect, {
        maxManualNonCompliant: MAX_MANUAL_NON_COMPLIANT,
        maxBeautyNonCompliant: MAX_BEAUTY_NON_COMPLIANT,
      });
    });

    await test.step("submit", () => submitGallery(galleryPage));
  });
});
