import { Image, ImageType } from '@monkvision/types';
import { getInspectionImages } from '../../src';

const inspectionIdMock = 'test-inspection-1';
const imagesMock = [
  { id: 'test-1', inspectionId: 'test-1', type: ImageType.CLOSE_UP },
  {
    id: 'test-2',
    inspectionId: inspectionIdMock,
    sightId: 'sight-1',
    createdAt: Date.parse('1998-01-01T01:01:01.001Z'),
    type: ImageType.BEAUTY_SHOT,
  },
  {
    id: 'test-3',
    inspectionId: inspectionIdMock,
    sightId: 'sight-1',
    createdAt: Date.parse('2020-01-01T01:01:01.001Z'),
    type: ImageType.BEAUTY_SHOT,
  },
  {
    id: 'test-4',
    inspectionId: inspectionIdMock,
    sightId: 'sight-1',
    createdAt: Date.parse('2024-01-01T01:01:01.001Z'),
    type: ImageType.BEAUTY_SHOT,
  },
  { id: 'test-5', inspectionId: inspectionIdMock, type: ImageType.CLOSE_UP },
  { id: 'test-6', inspectionId: inspectionIdMock, type: ImageType.CLOSE_UP },
  {
    id: 'test-7',
    inspectionId: inspectionIdMock,
    sightId: 'sight-2',
    createdAt: Date.parse('2024-01-01T01:01:01.001Z'),
    type: ImageType.BEAUTY_SHOT,
  },
  {
    id: 'test-8',
    inspectionId: inspectionIdMock,
    sightId: 'sight-2',
    createdAt: Date.parse('1998-01-01T01:01:01.001Z'),
    type: ImageType.BEAUTY_SHOT,
  },
] as Image[];

describe('State utils', () => {
  describe('getInspectionImages util function', () => {
    it('should return an empty array if there are no image in the inspection', () => {
      const images = [
        { id: 'test-1', inspectionId: 'test-1' },
        { id: 'test-2', inspectionId: 'test-2' },
      ] as Image[];
      expect(getInspectionImages('test-3', images).length).toBe(0);
    });

    it('should return the inspection images', () => {
      const inspectionId = 'test-inspection-1';
      const images = [
        { id: 'test-1', inspectionId: 'test-1' },
        { id: 'test-3', inspectionId },
        { id: 'test-2', inspectionId: 'test-2' },
        { id: 'test-6', inspectionId: 'test-2' },
        { id: 'test-4', inspectionId },
        { id: 'test-5', inspectionId },
      ] as Image[];
      const inspectionImages = getInspectionImages(inspectionId, images);
      expect(inspectionImages.length).toBe(3);
      expect(inspectionImages).toContainEqual({
        id: 'test-3',
        inspectionId,
      });
      expect(inspectionImages).toContainEqual({
        id: 'test-4',
        inspectionId,
      });
      expect(inspectionImages).toContainEqual({
        id: 'test-5',
        inspectionId,
      });
    });

    it('should properly filter retakes', () => {
      const inspectionImages = getInspectionImages(inspectionIdMock, imagesMock, undefined, true);
      expect(inspectionImages.length).toBe(4);
      expect(inspectionImages).toContainEqual(imagesMock.at(3));
      expect(inspectionImages).toContainEqual(imagesMock.at(4));
      expect(inspectionImages).toContainEqual(imagesMock.at(5));
      expect(inspectionImages).toContainEqual(imagesMock.at(6));
    });

    it('should properly filter image type by Image.CLOSE_UP', () => {
      const inspectionImages = getInspectionImages(
        inspectionIdMock,
        imagesMock,
        ImageType.CLOSE_UP,
        false,
      );
      expect(inspectionImages.length).toBe(2);
      expect(inspectionImages).toContainEqual(imagesMock.at(4));
      expect(inspectionImages).toContainEqual(imagesMock.at(5));
    });

    it('should properly filter image type by Image.BEAUTY_SHOT', () => {
      const inspectionImages = getInspectionImages(
        inspectionIdMock,
        imagesMock,
        ImageType.BEAUTY_SHOT,
        false,
      );
      expect(inspectionImages.length).toBe(5);
      expect(inspectionImages).toContainEqual(imagesMock.at(1));
      expect(inspectionImages).toContainEqual(imagesMock.at(2));
      expect(inspectionImages).toContainEqual(imagesMock.at(3));
      expect(inspectionImages).toContainEqual(imagesMock.at(6));
      expect(inspectionImages).toContainEqual(imagesMock.at(7));
    });
  });
});
