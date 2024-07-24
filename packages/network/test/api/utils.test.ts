import { getThumbnailUrl, THUMBNAIL_RESIZE_RATIO } from '../../src/api/utils';
import { Image } from '@monkvision/types';

describe('Monk API utilities functions', () => {
  describe('getThumbnailUrl function', () => {
    it('should return the formated thumbnail', () => {
      const thumbnailDomain = 'test-thumbnail-domain';
      const image = { path: 'test-path', width: 20, height: 30 } as unknown as Image;
      const result = getThumbnailUrl(thumbnailDomain, image.path, {
        width: image.width,
        height: image.height,
      });

      expect(result).toEqual(
        `https://${thumbnailDomain}/?image_url=${image.path}&width=${
          image.width * THUMBNAIL_RESIZE_RATIO
        }&height=${image.height * THUMBNAIL_RESIZE_RATIO}`,
      );
    });
  });
});
