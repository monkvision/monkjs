import { Image, ImageType } from '@monkvision/types';

/**
 * Utility function that extracts the images of the given inspection.
 *
 * @param inspectionId The ID of the inspection to get the images of.
 * @param images Array containing every image existing in the current local state.
 * @param filterImageType The specific image type to filter by. If not provided, no type-based filtering is applied.
 * @param filterRetakes Boolean indicating if retaken pictures should be filtered out or not (default: false).
 */
export function getInspectionImages(
  inspectionId: string,
  images: Image[],
  filterImageType?: ImageType,
  filterRetakes = false,
): Image[] {
  let inspectionImages = images.filter((image) => image.inspectionId === inspectionId);

  if (filterImageType) {
    inspectionImages = inspectionImages.filter((image) => filterImageType === image.type);
  }

  if (!filterRetakes) {
    return inspectionImages;
  }

  const filteredRetakes: Record<string, Image> = {};
  inspectionImages.forEach((image) => {
    if (image.sightId) {
      const existingImage = filteredRetakes[image.sightId];
      if (
        !existingImage ||
        (image.createdAt && existingImage.createdAt && image.createdAt > existingImage.createdAt)
      ) {
        filteredRetakes[image.sightId] = image;
      }
    } else {
      filteredRetakes[image.id] = image;
    }
  });

  return Object.values(filteredRetakes);
}
