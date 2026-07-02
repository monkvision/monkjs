import {
  test as authTest,
  expect,
} from "../../../shared/fixtures/auth.fixture";
import type { Page } from "@playwright/test";
import {
  CreateInspectionPage,
  VehicleTypeSelectionPage,
  CaptureSelectionPage,
  PhotoCaptureTutorialPage,
  PhotoCapturePage,
} from "../pages";
import { GalleryPage } from "../../../shared/pages/GalleryPage";

interface DemoAppFixtures {
  createInspectionPage: CreateInspectionPage;
  vehicleTypeSelectionPage: VehicleTypeSelectionPage;
  captureSelectionPage: CaptureSelectionPage;
  photoCaptureTutorialPage: PhotoCaptureTutorialPage;
  photoCapturePage: PhotoCapturePage;
  galleryPage: GalleryPage;
}

export const test = authTest.extend<DemoAppFixtures>({
  createInspectionPage: async (
    { page }: { page: Page },
    use: (f: CreateInspectionPage) => Promise<void>
  ) => use(new CreateInspectionPage(page)),
  vehicleTypeSelectionPage: async (
    { page }: { page: Page },
    use: (f: VehicleTypeSelectionPage) => Promise<void>
  ) => use(new VehicleTypeSelectionPage(page)),
  captureSelectionPage: async (
    { page }: { page: Page },
    use: (f: CaptureSelectionPage) => Promise<void>
  ) => use(new CaptureSelectionPage(page)),
  photoCaptureTutorialPage: async (
    { page }: { page: Page },
    use: (f: PhotoCaptureTutorialPage) => Promise<void>
  ) => use(new PhotoCaptureTutorialPage(page)),
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
