import {
  fakeCameraFixtures,
  FakeCameraFixture,
} from "../../../shared/fixtures/fake-camera.fixture";
import { test as authTest } from "../../../shared/fixtures/auth.fixture";
import {
  CreateInspectionPage,
  VehicleTypeSelectionPage,
  PhotoCaptureTutorialPage,
  PhotoCapturePage,
  GalleryPage,
} from "../pages";

// FakeCameraFixture includes the auto setupFakeCamera fixture (void)
interface DemoAppFixtures extends FakeCameraFixture {
  createInspectionPage: CreateInspectionPage;
  vehicleTypeSelectionPage: VehicleTypeSelectionPage;
  photoCaptureTutorialPage: PhotoCaptureTutorialPage;
  photoCapturePage: PhotoCapturePage;
  galleryPage: GalleryPage;
}

export const test = authTest.extend<DemoAppFixtures>({
  ...fakeCameraFixtures,
  createInspectionPage: async ({ page }, use) =>
    use(new CreateInspectionPage(page)),
  vehicleTypeSelectionPage: async ({ page }, use) =>
    use(new VehicleTypeSelectionPage(page)),
  photoCaptureTutorialPage: async ({ page }, use) =>
    use(new PhotoCaptureTutorialPage(page)),
  photoCapturePage: async ({ page }, use) => use(new PhotoCapturePage(page)),
  galleryPage: async ({ page }, use) => use(new GalleryPage(page)),
});

export { expect } from "@playwright/test";
