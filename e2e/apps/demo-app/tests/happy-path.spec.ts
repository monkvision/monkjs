import { test, expect } from "../fixtures";

test.describe("demo-app happy path", () => {
  test("creates inspection, captures all sights, reviews gallery and submits", async ({
    authenticatedPage,
    createInspectionPage,
    vehicleTypeSelectionPage,
    photoCaptureTutorialPage,
    photoCapturePage,
    galleryPage,
  }) => {
    await createInspectionPage.waitForInspectionCreated();

    await vehicleTypeSelectionPage.confirmDefaultVehicleType();

    await photoCaptureTutorialPage.completeTutorial();

    await photoCapturePage.captureAllSights();

    await galleryPage.waitForGallery();
    expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);

    await galleryPage.submit();
  });
});
