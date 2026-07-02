import { test as authTest } from "../../../shared/fixtures/auth.fixture";
import {
  fakeCameraFixtures,
  FakeCameraFixture,
} from "../../../shared/fixtures/fake-camera.fixture";
import {
  PermissionsPage,
  TutorialPage,
  VideoCapturePage,
  VideoCaptureCompletePage,
  PhotoCapturePage,
  GalleryPage,
} from "../pages";

interface DemoVideoAppFixtures extends FakeCameraFixture {
  permissionsPage: PermissionsPage;
  tutorialPage: TutorialPage;
  videoCapturePage: VideoCapturePage;
  videoCaptureCompletePage: VideoCaptureCompletePage;
  photoCapturePage: PhotoCapturePage;
  galleryPage: GalleryPage;
}

export const test = authTest.extend<DemoVideoAppFixtures>({
  ...fakeCameraFixtures,
  permissionsPage: async ({ page }, use) => use(new PermissionsPage(page)),
  tutorialPage: async ({ page }, use) => use(new TutorialPage(page)),
  videoCapturePage: async ({ page }, use) => use(new VideoCapturePage(page)),
  videoCaptureCompletePage: async ({ page }, use) => use(new VideoCaptureCompletePage(page)),
  photoCapturePage: async ({ page }, use) => use(new PhotoCapturePage(page)),
  galleryPage: async ({ page }, use) => use(new GalleryPage(page)),
});

export { expect } from "@playwright/test";
