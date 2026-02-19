import { Polygon } from '@monkvision/types';
import { GalleryItem } from '../types';

/**
 * Helper function to calculate the area of a polygon using the Shoelace formula.
 *
 * @param polygon - An array of [x, y] coordinates representing the vertices of the polygon.
 * @returns The area of the polygon.
 */
export function calculatePolygonArea(polygon: Polygon): number {
  if (polygon.length < 3) {
    return 0; // Not a polygon
  }

  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i][0] * polygon[j][1] - polygon[j][0] * polygon[i][1];
  }
  return Math.abs(area / 2);
}

/**
 * Helper function to filter out duplicate gallery items based on their sight labels,
 * keeping only the most recent item for each sight.
 *
 * Images `createdAt` being undefined are considered less recent than those with a defined `createdAt`.
 */
export function filterDuplicateSights(items: GalleryItem[]): GalleryItem[] {
  const sightLabelMap = new Map<string, GalleryItem>();

  items.forEach((item) => {
    if (!item.sight?.label) {
      return;
    }

    const existingItem = sightLabelMap.get(item.sight.label);

    if (!existingItem) {
      sightLabelMap.set(item.sight.label, item);
      return;
    }

    const currentCreatedAt = item.image.createdAt;
    const existingCreatedAt = existingItem.image.createdAt;

    if (currentCreatedAt && !existingCreatedAt) {
      sightLabelMap.set(item.sight.label, item);
      return;
    }

    if (currentCreatedAt && existingCreatedAt) {
      if (new Date(currentCreatedAt) > new Date(existingCreatedAt)) {
        sightLabelMap.set(item.sight.label, item);
      }
    }
  });

  const itemsWithSightLabel = Array.from(sightLabelMap.values());
  const itemsWithoutSightLabel = items.filter((item) => !item.sight?.label);

  return [...itemsWithoutSightLabel, ...itemsWithSightLabel];
}
