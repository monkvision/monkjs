import { Image } from '@monkvision/types';

/**
 * Utility function that extracts the images of the given inspection.
 *
 * @param inspectionId The ID of the inspection to get the images of.
 * @param images Array containing every image existing in the current local state.
 * @param filterRetakes Boolean indicating if retaken pictures should be filtered out or not (default: false).
 */
export function getInspectionImages(
  inspectionId: string,
  images: Image[],
  filterRetakes = false,
): Image[] {
  const inspectionImages = images.filter((image) => image.inspectionId === inspectionId);
  if (!filterRetakes) {
    return inspectionImages;
  }
  const filteredRetakes: Image[] = [];
  inspectionImages.forEach((image) => {
    if (image.sightId) {
      const index = filteredRetakes.findIndex((i) => i.sightId === image.sightId);
      if (index >= 0) {
        if (
          image.createdAt &&
          filteredRetakes[index].createdAt &&
          image.createdAt > (filteredRetakes[index].createdAt as number)
        ) {
          filteredRetakes[index] = image;
        }
        return;
      }
    }
    filteredRetakes.push(image);
  });
  return filteredRetakes;
}
