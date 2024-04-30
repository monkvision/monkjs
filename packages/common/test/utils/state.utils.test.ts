import { Image } from '@monkvision/types';
import { getInspectionImages } from '../../src';

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
      const inspectionId = 'test-inspection-1';
      const images = [
        { id: 'test-1', inspectionId: 'test-1' },
        {
          id: 'test-2',
          inspectionId,
          additionalData: {
            sight_id: 'sight-1',
            created_at: Date.parse('1998-01-01T01:01:01.001Z'),
          },
        },
        {
          id: 'test-3',
          inspectionId,
          additionalData: {
            sight_id: 'sight-1',
            created_at: Date.parse('2020-01-01T01:01:01.001Z'),
          },
        },
        {
          id: 'test-4',
          inspectionId,
          additionalData: {
            sight_id: 'sight-1',
            created_at: Date.parse('2024-01-01T01:01:01.001Z'),
          },
        },
        { id: 'test-5', inspectionId },
        { id: 'test-6', inspectionId },
        {
          id: 'test-7',
          inspectionId,
          additionalData: {
            sight_id: 'sight-2',
            created_at: Date.parse('2024-01-01T01:01:01.001Z'),
          },
        },
        {
          id: 'test-8',
          inspectionId,
          additionalData: {
            sight_id: 'sight-2',
            created_at: Date.parse('1998-01-01T01:01:01.001Z'),
          },
        },
      ] as Image[];
      const inspectionImages = getInspectionImages(inspectionId, images, true);
      expect(inspectionImages.length).toBe(4);
      expect(inspectionImages).toContainEqual({
        id: 'test-4',
        inspectionId,
        additionalData: {
          sight_id: 'sight-1',
          created_at: Date.parse('2024-01-01T01:01:01.001Z'),
        },
      });
      expect(inspectionImages).toContainEqual({
        id: 'test-5',
        inspectionId,
      });
      expect(inspectionImages).toContainEqual({
        id: 'test-6',
        inspectionId,
      });
      expect(inspectionImages).toContainEqual({
        id: 'test-7',
        inspectionId,
        additionalData: {
          sight_id: 'sight-2',
          created_at: Date.parse('2024-01-01T01:01:01.001Z'),
        },
      });
    });
  });
});
