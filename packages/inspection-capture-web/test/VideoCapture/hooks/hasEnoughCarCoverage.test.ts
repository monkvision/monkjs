import { Image, ImageStatus, ImageType, MonkEntityType } from '@monkvision/types';
import {
  hasEnoughCarCoverage,
} from '../../../src/VideoCapture/hooks/useGetInspection';

function createImage(alpha?: number, inspectionId = 'test-inspection'): Image {
  return {
    id: `img-${Math.random()}`,
    entityType: MonkEntityType.IMAGE,
    inspectionId,
    path: '',
    thumbnailPath: '',
    width: 100,
    height: 100,
    size: 1000,
    mimetype: 'image/jpeg',
    type: ImageType.BEAUTY_SHOT,
    status: ImageStatus.SUCCESS,
    renderedOutputs: [],
    views: [],
    additionalData: alpha !== undefined ? { alpha } : undefined,
  };
}

function createImagesForBucket(bucketIndex: number, count: number): Image[] {
  const bucketSize = 60;
  const bucketStart = bucketIndex * bucketSize;
  return Array.from({ length: count }, (_, i) =>
    createImage(bucketStart + (i * bucketSize) / count),
  );
}

function createFullCoverageImages(imagesPerBucket = 5): Image[] {
  return Array.from({ length: 6 }, (_, i) =>
    createImagesForBucket(i, imagesPerBucket),
  ).flat();
}

describe('hasEnoughCarCoverage', () => {
  it('should return false when there are no images', () => {
    expect(hasEnoughCarCoverage([])).toBe(false);
  });

  it('should return false when images have no alpha data', () => {
    const images = Array.from({ length: 30 }, () => createImage(undefined));
    expect(hasEnoughCarCoverage(images)).toBe(false);
  });

  it('should return true when all 6 buckets have at least 1 image', () => {
    const images = createFullCoverageImages(5);
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should return true when buckets have more than 1 image', () => {
    const images = createFullCoverageImages(10);
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should return false when one bucket has no images', () => {
    const images = [
      ...createImagesForBucket(0, 5),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 0),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(false);
  });

  it('should correctly assign alpha=0 to bucket 0', () => {
    const images = [
      ...Array.from({ length: 5 }, () => createImage(0)),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should correctly assign alpha=359 to bucket 5 (last bucket)', () => {
    const images = [
      ...createImagesForBucket(0, 5),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...Array.from({ length: 5 }, () => createImage(359)),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should correctly assign alpha=60 to bucket 1', () => {
    const images = [
      ...createImagesForBucket(0, 5),
      ...Array.from({ length: 5 }, () => createImage(60)),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should handle alpha=360 by normalizing to bucket 0', () => {
    const images = [
      ...Array.from({ length: 5 }, () => createImage(360)),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should skip images without additionalData', () => {
    const imagesWithAlpha = createFullCoverageImages(5);
    const imagesWithout = Array.from({ length: 10 }, () => createImage(undefined));
    expect(hasEnoughCarCoverage([...imagesWithAlpha, ...imagesWithout])).toBe(true);
  });
});
