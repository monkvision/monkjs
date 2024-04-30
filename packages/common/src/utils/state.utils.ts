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
    if (image.additionalData?.sight_id) {
      const index = filteredRetakes.findIndex(
        (i) => i.additionalData?.sight_id === image.additionalData?.sight_id,
      );
      if (index >= 0) {
        const imageDateISO = image.additionalData?.created_at;
        const alreadyExistingImageDateISO = filteredRetakes[index].additionalData?.created_at;
        if (
          alreadyExistingImageDateISO &&
          imageDateISO &&
          new Date(imageDateISO) > new Date(alreadyExistingImageDateISO)
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
