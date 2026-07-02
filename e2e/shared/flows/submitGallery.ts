import type { GalleryPage } from "../pages/GalleryPage";

export async function submitGallery(galleryPage: GalleryPage): Promise<void> {
  await galleryPage.waitForGallery();
  await galleryPage.submit();
}
