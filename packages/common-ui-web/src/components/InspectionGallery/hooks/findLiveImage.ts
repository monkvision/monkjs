import { Image } from '@monkvision/types';

/**
 * Resolves the live version of an image from the state images. After an upload the local image is replaced by one
 * with a different ID but the same `created_at` additional data, so it is used as a fallback match.
 */
export function findLiveImage(images: Image[], reference: Image): Image {
  const sameId = images.find((image) => image.id === reference.id);
  if (sameId) {
    return sameId;
  }
  const createdAt = reference.additionalData?.created_at;
  if (!createdAt) {
    return reference;
  }
  return (
    images.find(
      (image) =>
        image.inspectionId === reference.inspectionId &&
        image.additionalData?.created_at === createdAt,
    ) ?? reference
  );
}
