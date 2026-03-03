import { ImageType, Sight, Image } from '@monkvision/types';
import { calculatePolygonArea, filterDuplicateSights } from '../../src/utils/galleryItems.utils';
import { GalleryItem } from '../../src/types';

const MOCK_SQUARE_POLYGON = [
  [0, 0],
  [0, 4],
  [4, 4],
  [4, 0],
];
const MOCK_SQUARE_AREA = 16;

const MOCK_TRIANGLE_POLYGON = [
  [0, 0],
  [3, 0],
  [0, 4],
];
const MOCK_TRIANGLE_AREA = 6;

const MOCK_PENTAGON_POLYGON = [
  [0, 0],
  [2, 0],
  [3, 1.5],
  [1, 3],
  [-1, 1.5],
];

const MOCK_EMPTY_POLYGON: [number, number][] = [];
const MOCK_TWO_POINT_POLYGON = [
  [0, 0],
  [1, 1],
];

const MOCK_SIGHT_LABEL_1 = 'front-view';
const MOCK_SIGHT_LABEL_2 = 'back-view';
const MOCK_SIGHT_LABEL_3 = 'side-view';

const MOCK_DATE_OLD = 1704103200000;
const MOCK_DATE_RECENT = 1704189600000;
const MOCK_DATE_NEWEST = 1704276000000;

const createMockImage = (overrides?: Partial<Image>): Image =>
  ({
    id: 'image-id',
    type: ImageType.BEAUTY_SHOT,
    path: '/path/image.jpg',
    createdAt: MOCK_DATE_RECENT,
    ...overrides,
  } as Image);

const createMockSight = (overrides?: Partial<Sight>): Sight =>
  ({
    id: 'sight-id',
    imageId: 'image-id',
    label: MOCK_SIGHT_LABEL_1,
    ...overrides,
  } as Sight);

const createMockGalleryItem = (overrides?: Partial<GalleryItem>): GalleryItem => ({
  image: createMockImage(),
  sight: createMockSight(),
  renderedOutput: undefined,
  hasDamage: false,
  parts: [],
  totalPolygonArea: 0,
  ...overrides,
});

describe('galleryItems.utils', () => {
  describe('calculatePolygonArea', () => {
    it('should calculate area for a square polygon', () => {
      const area = calculatePolygonArea(MOCK_SQUARE_POLYGON);

      expect(area).toBe(MOCK_SQUARE_AREA);
    });

    it('should calculate area for a triangle polygon', () => {
      const area = calculatePolygonArea(MOCK_TRIANGLE_POLYGON);

      expect(area).toBe(MOCK_TRIANGLE_AREA);
    });

    it('should calculate area for a pentagon polygon', () => {
      const area = calculatePolygonArea(MOCK_PENTAGON_POLYGON);

      expect(area).toBeGreaterThan(0);
      expect(typeof area).toBe('number');
    });

    it('should return 0 for empty polygon', () => {
      const area = calculatePolygonArea(MOCK_EMPTY_POLYGON);

      expect(area).toBe(0);
    });

    it('should return 0 for polygon with less than 3 points', () => {
      const area = calculatePolygonArea(MOCK_TWO_POINT_POLYGON);

      expect(area).toBe(0);
    });

    it('should return absolute value for polygon area', () => {
      const clockwisePolygon = [...MOCK_SQUARE_POLYGON];
      const counterClockwisePolygon = [...MOCK_SQUARE_POLYGON].reverse();

      const area1 = calculatePolygonArea(clockwisePolygon);
      const area2 = calculatePolygonArea(counterClockwisePolygon);

      expect(area1).toBe(area2);
      expect(area1).toBeGreaterThanOrEqual(0);
    });

    it('should handle polygon with decimal coordinates', () => {
      const decimalPolygon = [
        [0.5, 0.5],
        [2.5, 0.5],
        [2.5, 2.5],
        [0.5, 2.5],
      ];

      const area = calculatePolygonArea(decimalPolygon);

      expect(area).toBe(4);
    });
  });

  describe('filterDuplicateSights', () => {
    describe('duplicate filtering', () => {
      it('should keep most recent item when duplicates exist', () => {
        const oldItem = createMockGalleryItem({
          image: createMockImage({ id: 'old-image', createdAt: MOCK_DATE_OLD }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const recentItem = createMockGalleryItem({
          image: createMockImage({ id: 'recent-image', createdAt: MOCK_DATE_RECENT }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });

        const result = filterDuplicateSights([oldItem, recentItem]);

        expect(result).toHaveLength(1);
        expect(result[0].image.id).toBe(recentItem.image.id);
      });

      it('should keep newest item when multiple duplicates exist', () => {
        const oldItem = createMockGalleryItem({
          image: createMockImage({ id: 'old-image', createdAt: MOCK_DATE_OLD }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const recentItem = createMockGalleryItem({
          image: createMockImage({ id: 'recent-image', createdAt: MOCK_DATE_RECENT }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const newestItem = createMockGalleryItem({
          image: createMockImage({ id: 'newest-image', createdAt: MOCK_DATE_NEWEST }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });

        const result = filterDuplicateSights([oldItem, recentItem, newestItem]);

        expect(result).toHaveLength(1);
        expect(result[0].image.id).toBe(newestItem.image.id);
      });

      it('should keep items with different sight labels', () => {
        const item1 = createMockGalleryItem({
          image: createMockImage({ id: 'image-1' }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const item2 = createMockGalleryItem({
          image: createMockImage({ id: 'image-2' }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_2 }),
        });
        const item3 = createMockGalleryItem({
          image: createMockImage({ id: 'image-3' }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_3 }),
        });

        const result = filterDuplicateSights([item1, item2, item3]);

        expect(result).toHaveLength(3);
        expect(result.map((r) => r.image.id)).toContain(item1.image.id);
        expect(result.map((r) => r.image.id)).toContain(item2.image.id);
        expect(result.map((r) => r.image.id)).toContain(item3.image.id);
      });
    });

    describe('undefined createdAt handling', () => {
      it('should prefer item with createdAt over item without createdAt', () => {
        const itemWithoutDate = createMockGalleryItem({
          image: createMockImage({ id: 'no-date-image', createdAt: undefined }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const itemWithDate = createMockGalleryItem({
          image: createMockImage({ id: 'with-date-image', createdAt: MOCK_DATE_RECENT }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });

        const result = filterDuplicateSights([itemWithoutDate, itemWithDate]);

        expect(result).toHaveLength(1);
        expect(result[0].image.id).toBe(itemWithDate.image.id);
      });

      it('should keep first item when both lack createdAt', () => {
        const item1 = createMockGalleryItem({
          image: createMockImage({ id: 'image-1', createdAt: undefined }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const item2 = createMockGalleryItem({
          image: createMockImage({ id: 'image-2', createdAt: undefined }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });

        const result = filterDuplicateSights([item1, item2]);

        expect(result).toHaveLength(1);
        expect(result[0].image.id).toBe(item1.image.id);
      });

      it('should not replace item with date when later item has no date', () => {
        const itemWithDate = createMockGalleryItem({
          image: createMockImage({ id: 'with-date-image', createdAt: MOCK_DATE_RECENT }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const itemWithoutDate = createMockGalleryItem({
          image: createMockImage({ id: 'no-date-image', createdAt: undefined }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });

        const result = filterDuplicateSights([itemWithDate, itemWithoutDate]);

        expect(result).toHaveLength(1);
        expect(result[0].image.id).toBe(itemWithDate.image.id);
      });
    });

    describe('items without sight labels', () => {
      it('should keep all items without sight labels', () => {
        const item1 = createMockGalleryItem({
          image: createMockImage({ id: 'image-1' }),
          sight: undefined,
        });
        const item2 = createMockGalleryItem({
          image: createMockImage({ id: 'image-2' }),
          sight: undefined,
        });
        const item3 = createMockGalleryItem({
          image: createMockImage({ id: 'image-3' }),
          sight: undefined,
        });

        const result = filterDuplicateSights([item1, item2, item3]);

        expect(result).toHaveLength(3);
      });

      it('should keep items with undefined sight label', () => {
        const item = createMockGalleryItem({
          image: createMockImage({ id: 'image-1' }),
          sight: createMockSight({ label: undefined }),
        });

        const result = filterDuplicateSights([item]);

        expect(result).toHaveLength(1);
        expect(result[0].image.id).toBe(item.image.id);
      });

      it('should keep items without sight alongside items with sight', () => {
        const itemWithoutSight = createMockGalleryItem({
          image: createMockImage({ id: 'no-sight' }),
          sight: undefined,
        });
        const itemWithSight = createMockGalleryItem({
          image: createMockImage({ id: 'with-sight' }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });

        const result = filterDuplicateSights([itemWithoutSight, itemWithSight]);

        expect(result).toHaveLength(2);
        expect(result.map((r) => r.image.id)).toContain(itemWithoutSight.image.id);
        expect(result.map((r) => r.image.id)).toContain(itemWithSight.image.id);
      });
    });

    describe('result ordering', () => {
      it('should place items without sight labels first', () => {
        const itemWithoutSight1 = createMockGalleryItem({
          image: createMockImage({ id: 'no-sight-1' }),
          sight: undefined,
        });
        const itemWithoutSight2 = createMockGalleryItem({
          image: createMockImage({ id: 'no-sight-2' }),
          sight: undefined,
        });
        const itemWithSight = createMockGalleryItem({
          image: createMockImage({ id: 'with-sight' }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });

        const result = filterDuplicateSights([itemWithSight, itemWithoutSight1, itemWithoutSight2]);

        expect(result[0].image.id).toBe(itemWithoutSight1.image.id);
        expect(result[1].image.id).toBe(itemWithoutSight2.image.id);
        expect(result[2].image.id).toBe(itemWithSight.image.id);
      });

      it('should maintain order of items without sight labels', () => {
        const item1 = createMockGalleryItem({
          image: createMockImage({ id: 'image-1' }),
          sight: undefined,
        });
        const item2 = createMockGalleryItem({
          image: createMockImage({ id: 'image-2' }),
          sight: undefined,
        });
        const item3 = createMockGalleryItem({
          image: createMockImage({ id: 'image-3' }),
          sight: undefined,
        });

        const result = filterDuplicateSights([item1, item2, item3]);

        expect(result[0].image.id).toBe(item1.image.id);
        expect(result[1].image.id).toBe(item2.image.id);
        expect(result[2].image.id).toBe(item3.image.id);
      });
    });

    describe('edge cases', () => {
      it('should handle empty array', () => {
        const result = filterDuplicateSights([]);

        expect(result).toEqual([]);
      });

      it('should handle single item', () => {
        const item = createMockGalleryItem();

        const result = filterDuplicateSights([item]);

        expect(result).toHaveLength(1);
        expect(result[0]).toBe(item);
      });

      it('should handle complex mixed scenario', () => {
        const itemNoSight1 = createMockGalleryItem({
          image: createMockImage({ id: 'no-sight-1' }),
          sight: undefined,
        });
        const itemNoSight2 = createMockGalleryItem({
          image: createMockImage({ id: 'no-sight-2' }),
          sight: undefined,
        });
        const itemOldLabel1 = createMockGalleryItem({
          image: createMockImage({ id: 'old-label-1', createdAt: MOCK_DATE_OLD }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const itemRecentLabel1 = createMockGalleryItem({
          image: createMockImage({ id: 'recent-label-1', createdAt: MOCK_DATE_RECENT }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_1 }),
        });
        const itemLabel2 = createMockGalleryItem({
          image: createMockImage({ id: 'label-2' }),
          sight: createMockSight({ label: MOCK_SIGHT_LABEL_2 }),
        });

        const result = filterDuplicateSights([
          itemOldLabel1,
          itemNoSight1,
          itemRecentLabel1,
          itemLabel2,
          itemNoSight2,
        ]);

        expect(result).toHaveLength(4);
        expect(result[0].image.id).toBe(itemNoSight1.image.id);
        expect(result[1].image.id).toBe(itemNoSight2.image.id);

        const resultWithSights = result.slice(2);
        expect(resultWithSights.map((r) => r.image.id)).toContain(itemRecentLabel1.image.id);
        expect(resultWithSights.map((r) => r.image.id)).toContain(itemLabel2.image.id);
        expect(resultWithSights.map((r) => r.image.id)).not.toContain(itemOldLabel1.image.id);
      });
    });
  });
});
