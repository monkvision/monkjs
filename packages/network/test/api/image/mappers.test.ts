import data from './apiImage.data.json';
import apiImageParsed from './apiImage.data';
import { ApiImage } from '../../../src/api/models';
import { mapApiImage } from '../../../src/api/image/mappers';

describe('Image API Mappers', () => {
  describe('ApiImage mapper', () => {
    it('should properly map the ApiImage object', () => {
      const inspectionId = 'test-id';
      const result = mapApiImage(data as unknown as ApiImage, inspectionId);
      expect(result).toEqual({
        ...apiImageParsed,
        inspectionId,
      });
    });
  });
});
