import { renderHook, act } from '@testing-library/react';
import { Image, Viewpoint } from '@monkvision/types';
import { useImageSelector } from '../../../src/components/ImageDetailedView/hooks';

describe('useImageSelector hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function createImage(id: string): Image {
    return { id } as Image;
  }

  describe('initial state', () => {
    it('should return the correct initial state with no alternatives', () => {
      const image = createImage('img-1');
      const { result, unmount } = renderHook(() => useImageSelector(image));

      expect(result.current.selectedImage).toBe(image);
      expect(result.current.validatedImage).toBe(image);
      expect(result.current.hasChanged).toBe(false);
      expect(result.current.hasAlternatives).toBe(false);
      expect(result.current.showThumbnails).toBe(false);
      expect(result.current.showSuccessMessage).toBe(false);
      expect(result.current.hasValidatedOnce).toBe(false);

      unmount();
    });
  });

  describe('hasAlternatives', () => {
    it('should return true when alternativeImages has items', () => {
      const image = createImage('img-1');
      const alternatives = [createImage('alt-1')];
      const { result, unmount } = renderHook(() => useImageSelector(image, alternatives));

      expect(result.current.hasAlternatives).toBe(true);

      unmount();
    });
  });

  describe('images array', () => {
    it('should combine image and alternativeImages', () => {
      const image = createImage('img-1');
      const alternatives = [createImage('alt-1'), createImage('alt-2')];
      const { result, unmount } = renderHook(() => useImageSelector(image, alternatives));

      expect(result.current.images).toEqual([image, ...alternatives]);
      expect(result.current.images).toHaveLength(3);

      unmount();
    });

    it('should limit alternatives to 3 (4 total max)', () => {
      const image = createImage('img-1');
      const alternatives = [
        createImage('alt-1'),
        createImage('alt-2'),
        createImage('alt-3'),
        createImage('alt-4'),
        createImage('alt-5'),
      ];
      const { result, unmount } = renderHook(() => useImageSelector(image, alternatives));

      expect(result.current.images).toHaveLength(4);
      expect(result.current.images[0]).toBe(image);
      expect(result.current.images[1]).toBe(alternatives[0]);
      expect(result.current.images[2]).toBe(alternatives[1]);
      expect(result.current.images[3]).toBe(alternatives[2]);

      unmount();
    });
  });

  describe('selectImage', () => {
    it('should update selectedImage and call onImageSelected', () => {
      const image = createImage('img-1');
      const alternatives = [createImage('alt-1'), createImage('alt-2')];
      const onImageSelected = jest.fn();
      const { result, unmount } = renderHook(() =>
        useImageSelector(image, alternatives, onImageSelected),
      );

      act(() => {
        result.current.selectImage(1);
      });

      expect(result.current.selectedImage).toBe(alternatives[0]);
      expect(onImageSelected).toHaveBeenCalledWith(alternatives[0]);

      unmount();
    });

    it('should set hasChanged to true when selecting a different image', () => {
      const image = createImage('img-1');
      const alternatives = [createImage('alt-1')];
      const { result, unmount } = renderHook(() => useImageSelector(image, alternatives));

      expect(result.current.hasChanged).toBe(false);

      act(() => {
        result.current.selectImage(1);
      });

      expect(result.current.hasChanged).toBe(true);

      unmount();
    });
  });

  describe('handleValidate', () => {
    it('should update state and call onValidateAlternative', () => {
      const image = createImage('img-1');
      const alternatives = [createImage('alt-1')];
      const onValidateAlternative = jest.fn();
      const { result, unmount } = renderHook(() =>
        useImageSelector(image, alternatives, undefined, onValidateAlternative),
      );

      act(() => {
        result.current.selectImage(1);
      });

      const view = Viewpoint.FRONT;
      act(() => {
        result.current.handleValidate(alternatives[0], view);
      });

      expect(result.current.hasValidatedOnce).toBe(true);
      expect(result.current.showSuccessMessage).toBe(true);
      expect(onValidateAlternative).toHaveBeenCalledWith(alternatives[0], view);

      unmount();
    });

    it('should reset hasChanged after validating', () => {
      const image = createImage('img-1');
      const alternatives = [createImage('alt-1')];
      const { result, unmount } = renderHook(() => useImageSelector(image, alternatives));

      act(() => {
        result.current.selectImage(1);
      });
      expect(result.current.hasChanged).toBe(true);

      act(() => {
        result.current.handleValidate(alternatives[0], Viewpoint.FRONT);
      });
      expect(result.current.hasChanged).toBe(false);

      unmount();
    });
  });

  describe('showSuccessMessage timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should reset showSuccessMessage to false after 1000ms', () => {
      const image = createImage('img-1');
      const alternatives = [createImage('alt-1')];
      const { result, unmount } = renderHook(() => useImageSelector(image, alternatives));

      act(() => {
        result.current.selectImage(1);
      });

      act(() => {
        result.current.handleValidate(alternatives[0], Viewpoint.FRONT);
      });
      expect(result.current.showSuccessMessage).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.showSuccessMessage).toBe(false);

      unmount();
    });
  });

  describe('showThumbnails', () => {
    it('should update showThumbnails when setShowThumbnails is called', () => {
      const image = createImage('img-1');
      const { result, unmount } = renderHook(() => useImageSelector(image));

      expect(result.current.showThumbnails).toBe(false);

      act(() => {
        result.current.setShowThumbnails(true);
      });
      expect(result.current.showThumbnails).toBe(true);

      unmount();
    });
  });
});
