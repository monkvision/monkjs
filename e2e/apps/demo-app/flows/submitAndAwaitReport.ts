import type { GalleryPage } from "../../../shared/pages/GalleryPage";
import type { DamageReportPage } from "../pages/DamageReportPage";

export async function submitAndAwaitReport(
  galleryPage: GalleryPage,
  damageReportPage: DamageReportPage
): Promise<void> {
  await galleryPage.waitForGallery();
  await galleryPage.waitForPendingToSettle();
  try {
    await galleryPage.submit(5_000);
  } catch {
    // page may have already auto-redirected to Inspection Report
  }
  await damageReportPage.waitFor();
}
