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
  DamageReportPage,
} from "../pages";

interface DemoAppFixtures extends FakeCameraFixture {
  createInspectionPage: CreateInspectionPage;
  vehicleTypeSelectionPage: VehicleTypeSelectionPage;
  photoCaptureTutorialPage: PhotoCaptureTutorialPage;
  photoCapturePage: PhotoCapturePage;
  galleryPage: GalleryPage;
  damageReportPage: DamageReportPage;
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
  damageReportPage: async ({ page }, use) => use(new DamageReportPage(page)),
});
