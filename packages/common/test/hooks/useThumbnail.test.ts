import { renderHook } from '@testing-library/react-hooks';
import { Image, THUMBNAIL_RESIZE_RATIO } from '@monkvision/types';
import { useThumbnail } from '../../src';

const thumbnailDomainMock = 'test-thumbnail-domain';

describe('useThumbnail hook', () => {
  it('should return a getThumbnailUrl function', () => {
    const { result, unmount } = renderHook(useThumbnail);

    expect(typeof result.current.getThumbnailUrl).toBe('function');
    unmount();
  });

  it('should return a formated url', () => {
    const { result, unmount } = renderHook(useThumbnail, { initialProps: thumbnailDomainMock });

    const imageMock = { path: 'test-path', width: 20, height: 40 } as Image;
    expect(result.current.getThumbnailUrl(imageMock)).toEqual(
      `https://${thumbnailDomainMock}/?image_url=${imageMock.path}&width=${
        imageMock.width * THUMBNAIL_RESIZE_RATIO
      }&height=${imageMock.height * THUMBNAIL_RESIZE_RATIO}`,
    );
    unmount();
  });
});
