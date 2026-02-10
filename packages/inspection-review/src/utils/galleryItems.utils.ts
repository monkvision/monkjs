import { Polygon } from '@monkvision/types';

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
