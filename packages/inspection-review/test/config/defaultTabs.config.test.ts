import { Image, ImageType, Sight } from '@monkvision/types';
import { defaultTabs } from '../../src/config/defaultTabs.config';
import { TabKeys, type GalleryItem, type TabActivationAPI } from '../../src/types';
import { ExteriorTab } from '../../src/components/ExteriorTab';
import { InteriorTab } from '../../src/components/InteriorTab';

jest.mock('../../src/components/ExteriorTab', () => ({
  ExteriorTab: jest.fn(),
}));

jest.mock('../../src/components/InteriorTab', () => ({
  InteriorTab: jest.fn(),
}));

const MOCK_SIGHT_ID_EXTERIOR_1 = 'sight-exterior-1';
const MOCK_SIGHT_ID_EXTERIOR_2 = 'sight-exterior-2';
const MOCK_SIGHT_ID_INTERIOR_1 = 'sight-interior-1';
const MOCK_SIGHT_ID_UNMATCHED = 'sight-unmatched';

const createMockGalleryItem = (overrides?: Partial<GalleryItem>): GalleryItem =>
  ({
    id: 'item-id',
    image: {
      id: 'image-id',
      type: ImageType.BEAUTY_SHOT,
      path: '/path/image.jpg',
    },
    sight: {
      id: 'sight-id',
      imageId: 'image-id',
    },
    renderedOutput: undefined,
    hasDamage: false,
    parts: [],
    totalPolygonArea: 0,
    ...overrides,
  } as GalleryItem);

const MOCK_GALLERY_ITEM_EXTERIOR_1 = createMockGalleryItem({
  image: { id: 'image-exterior-1', type: ImageType.BEAUTY_SHOT, path: '/path/1.jpg' } as any,
  sight: { id: MOCK_SIGHT_ID_EXTERIOR_1, imageId: 'image-exterior-1' } as any,
});

const MOCK_GALLERY_ITEM_EXTERIOR_2 = createMockGalleryItem({
  image: { id: 'image-exterior-2', type: ImageType.BEAUTY_SHOT, path: '/path/2.jpg' } as any,
  sight: { id: MOCK_SIGHT_ID_EXTERIOR_2, imageId: 'image-exterior-2' } as any,
});

const MOCK_GALLERY_ITEM_INTERIOR_1 = createMockGalleryItem({
  image: { id: 'image-interior-1', type: ImageType.BEAUTY_SHOT, path: '/path/3.jpg' } as any,
  sight: { id: MOCK_SIGHT_ID_INTERIOR_1, imageId: 'image-interior-1' } as any,
});

const MOCK_GALLERY_ITEM_CLOSE_UP = createMockGalleryItem({
  image: { id: 'image-close-up', type: ImageType.CLOSE_UP, path: '/path/close-up.jpg' } as any,
  sight: { id: 'sight-close-up', imageId: 'image-close-up' } as any,
});

const MOCK_GALLERY_ITEM_UNMATCHED = createMockGalleryItem({
  image: { id: 'image-unmatched', type: ImageType.BEAUTY_SHOT, path: '/path/unmatched.jpg' } as any,
  sight: { id: MOCK_SIGHT_ID_UNMATCHED, imageId: 'image-unmatched' } as any,
});

const MOCK_ALL_GALLERY_ITEMS = [
  MOCK_GALLERY_ITEM_EXTERIOR_1,
  MOCK_GALLERY_ITEM_EXTERIOR_2,
  MOCK_GALLERY_ITEM_INTERIOR_1,
  MOCK_GALLERY_ITEM_CLOSE_UP,
  MOCK_GALLERY_ITEM_UNMATCHED,
];

const MOCK_SIGHTS_PER_TAB = {
  [TabKeys.Exterior]: [MOCK_SIGHT_ID_EXTERIOR_1, MOCK_SIGHT_ID_EXTERIOR_2],
  [TabKeys.Interior]: [MOCK_SIGHT_ID_INTERIOR_1],
};

const mockSetCurrentGalleryItems = jest.fn();

const createMockTabActivationAPI = (overrides?: Partial<TabActivationAPI>): TabActivationAPI => ({
  allGalleryItems: MOCK_ALL_GALLERY_ITEMS,
  currentGalleryItems: MOCK_ALL_GALLERY_ITEMS,
  setCurrentGalleryItems: mockSetCurrentGalleryItems,
  sights: MOCK_SIGHTS_PER_TAB,
  unmatchedSightsTab: TabKeys.Exterior,
  unmatchedGalleryItems: [MOCK_GALLERY_ITEM_UNMATCHED],
  ...overrides,
});

describe('defaultTabs.config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('structure', () => {
    it('should define defaultTabs object', () => {
      expect(defaultTabs).toBeDefined();
      expect(typeof defaultTabs).toBe('object');
    });

    it('should have Exterior tab', () => {
      expect(defaultTabs[TabKeys.Exterior]).toBeDefined();
    });

    it('should have Interior tab', () => {
      expect(defaultTabs[TabKeys.Interior]).toBeDefined();
    });

    it('should have two default tabs', () => {
      const tabKeys = Object.keys(defaultTabs);
      expect(tabKeys).toHaveLength(Object.values(defaultTabs).length);
      expect(tabKeys).toContain(TabKeys.Exterior);
      expect(tabKeys).toContain(TabKeys.Interior);
    });
  });

  describe('Exterior tab', () => {
    it('should have ExteriorTab component', () => {
      const exteriorTab = defaultTabs[TabKeys.Exterior];
      expect('Component' in exteriorTab).toBe(true);
      if ('Component' in exteriorTab) {
        expect(exteriorTab.Component).toBe(ExteriorTab);
      }
    });

    it('should have onActivate callback', () => {
      const exteriorTab = defaultTabs[TabKeys.Exterior];
      expect('onActivate' in exteriorTab).toBe(true);
      if ('onActivate' in exteriorTab) {
        expect(typeof exteriorTab.onActivate).toBe('function');
      }
    });

    describe('onActivate behavior', () => {
      it('should call setCurrentGalleryItems with matched gallery items', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        expect(mockSetCurrentGalleryItems).toHaveBeenCalledTimes(1);
      });

      it('should include close-up images in gallery items', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_CLOSE_UP);
      });

      it('should include matched exterior gallery items', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_EXTERIOR_1);
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_EXTERIOR_2);
      });

      it('should not include interior gallery items', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).not.toContain(MOCK_GALLERY_ITEM_INTERIOR_1);
      });

      it('should include unmatched items when Exterior is unmatchedSightsTab', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI({
          unmatchedSightsTab: TabKeys.Exterior,
        });

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_UNMATCHED);
      });

      it('should not include unmatched items when Exterior is not unmatchedSightsTab', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI({
          unmatchedSightsTab: TabKeys.Interior,
        });

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).not.toContain(MOCK_GALLERY_ITEM_UNMATCHED);
      });

      it('should place close-up items first in the gallery', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        const closeUpIndex = calledWith.findIndex(
          (item: GalleryItem) => item.image.type === ImageType.CLOSE_UP,
        );
        const beautyShot = calledWith.findIndex(
          (item: GalleryItem) => item.image.type === ImageType.BEAUTY_SHOT,
        );

        if (closeUpIndex !== -1 && beautyShot !== -1) {
          expect(closeUpIndex).toBeLessThan(beautyShot);
        }
      });

      it('should handle empty sights for tab', () => {
        const exteriorTab = defaultTabs[TabKeys.Exterior];
        const api = createMockTabActivationAPI({
          sights: {
            [TabKeys.Exterior]: [],
            [TabKeys.Interior]: [],
          },
        });

        if ('onActivate' in exteriorTab && exteriorTab.onActivate) {
          exteriorTab.onActivate(api);
        }

        expect(mockSetCurrentGalleryItems).toHaveBeenCalled();
        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_CLOSE_UP);
      });
    });
  });

  describe('Interior tab', () => {
    it('should have InteriorTab component', () => {
      const interiorTab = defaultTabs[TabKeys.Interior];
      expect('Component' in interiorTab).toBe(true);
      if ('Component' in interiorTab) {
        expect(interiorTab.Component).toBe(InteriorTab);
      }
    });

    it('should have onActivate callback', () => {
      const interiorTab = defaultTabs[TabKeys.Interior];
      expect('onActivate' in interiorTab).toBe(true);
      if ('onActivate' in interiorTab) {
        expect(typeof interiorTab.onActivate).toBe('function');
      }
    });

    describe('onActivate behavior', () => {
      it('should call setCurrentGalleryItems with matched gallery items', () => {
        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        expect(mockSetCurrentGalleryItems).toHaveBeenCalledTimes(1);
      });

      it('should include matched interior gallery items', () => {
        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_INTERIOR_1);
      });

      it('should not include exterior gallery items', () => {
        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).not.toContain(MOCK_GALLERY_ITEM_EXTERIOR_1);
        expect(calledWith).not.toContain(MOCK_GALLERY_ITEM_EXTERIOR_2);
      });

      it('should not include close-up images', () => {
        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI();

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).not.toContain(MOCK_GALLERY_ITEM_CLOSE_UP);
      });

      it('should include unmatched items when Interior is unmatchedSightsTab', () => {
        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI({
          unmatchedSightsTab: TabKeys.Interior,
        });

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_UNMATCHED);
      });

      it('should not include unmatched items when Interior is not unmatchedSightsTab', () => {
        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI({
          unmatchedSightsTab: TabKeys.Exterior,
        });

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).not.toContain(MOCK_GALLERY_ITEM_UNMATCHED);
      });

      it('should handle empty sights for tab', () => {
        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI({
          sights: {
            [TabKeys.Exterior]: [],
            [TabKeys.Interior]: [],
          },
        });

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        expect(mockSetCurrentGalleryItems).toHaveBeenCalled();
        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toEqual([]);
      });

      it('should handle multiple sights for interior tab', () => {
        const MOCK_SIGHT_ID_INTERIOR_2 = 'sight-interior-2';
        const secondInteriorItem = createMockGalleryItem({
          image: { id: 'image-interior-2', type: ImageType.BEAUTY_SHOT } as unknown as Image,
          sight: { id: MOCK_SIGHT_ID_INTERIOR_2, imageId: 'image-interior-2' } as unknown as Sight,
        });

        const interiorTab = defaultTabs[TabKeys.Interior];
        const api = createMockTabActivationAPI({
          allGalleryItems: [...MOCK_ALL_GALLERY_ITEMS, secondInteriorItem],
          sights: {
            [TabKeys.Exterior]: [MOCK_SIGHT_ID_EXTERIOR_1],
            [TabKeys.Interior]: [MOCK_SIGHT_ID_INTERIOR_1, MOCK_SIGHT_ID_INTERIOR_2],
          },
        });

        if ('onActivate' in interiorTab && interiorTab.onActivate) {
          interiorTab.onActivate(api);
        }

        const calledWith = mockSetCurrentGalleryItems.mock.calls[0][0];
        expect(calledWith).toContain(MOCK_GALLERY_ITEM_INTERIOR_1);
        expect(calledWith).toContain(secondInteriorItem);
      });
    });
  });
});
