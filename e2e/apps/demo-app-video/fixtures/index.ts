import {
  test as authTest,
  expect,
} from "../../../shared/fixtures/auth.fixture";
import type { Page } from "@playwright/test";
import {
  PermissionsPage,
  TutorialPage,
  VideoCapturePage,
  VideoCaptureCompletePage,
  PhotoCapturePage,
} from "../pages";
import { GalleryPage } from "../../../shared/pages/GalleryPage";

interface DemoVideoAppFixtures {
  permissionsPage: PermissionsPage;
  tutorialPage: TutorialPage;
  videoCapturePage: VideoCapturePage;
  videoCaptureCompletePage: VideoCaptureCompletePage;
  photoCapturePage: PhotoCapturePage;
  galleryPage: GalleryPage;
}

export const test = authTest.extend<DemoVideoAppFixtures>({
  permissionsPage: async (
    { page }: { page: Page },
    use: (f: PermissionsPage) => Promise<void>
  ) => use(new PermissionsPage(page)),
  tutorialPage: async (
    { page }: { page: Page },
    use: (f: TutorialPage) => Promise<void>
  ) => use(new TutorialPage(page)),
  videoCapturePage: async (
    { page }: { page: Page },
    use: (f: VideoCapturePage) => Promise<void>
  ) => use(new VideoCapturePage(page)),
  videoCaptureCompletePage: async (
    { page }: { page: Page },
    use: (f: VideoCaptureCompletePage) => Promise<void>
  ) => use(new VideoCaptureCompletePage(page)),
  photoCapturePage: async (
    { page }: { page: Page },
    use: (f: PhotoCapturePage) => Promise<void>
  ) => use(new PhotoCapturePage(page)),
  galleryPage: async (
    { page }: { page: Page },
    use: (f: GalleryPage) => Promise<void>
  ) => use(new GalleryPage(page)),
});

export { expect };
