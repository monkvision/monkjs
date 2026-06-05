import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ImageType } from '@monkvision/types';
import { TabKeys, TabObject, type GalleryItem, type TabContent } from '../../src/types';
import { useTabsState, type TabsStateParams } from '../../src/hooks/useTabsState';
import { defaultTabs } from '../../src/config';

jest.mock('../../src/config', () => ({
  defaultTabs: {
    exterior: {
      Component: () => React.createElement('div', null, 'Exterior Tab'),
      onActivate: jest.fn(),
      onDeactivate: jest.fn(),
    },
    interior: {
      Component: () => React.createElement('div', null, 'Interior Tab'),
      onActivate: jest.fn(),
      onDeactivate: jest.fn(),
    },
  },
}));

const MOCK_SIGHT_ID_EXTERIOR_1 = 'sight-exterior-1';
const MOCK_SIGHT_ID_EXTERIOR_2 = 'sight-exterior-2';
const MOCK_SIGHT_ID_INTERIOR_1 = 'sight-interior-1';
const MOCK_SIGHT_ID_UNMATCHED = 'sight-unmatched';

const MOCK_IMAGE_EXTERIOR_1 = {
  id: 'image-exterior-1',
  type: ImageType.BEAUTY_SHOT,
  path: '/path/exterior-1.jpg',
};

const MOCK_IMAGE_EXTERIOR_2 = {
  id: 'image-exterior-2',
  type: ImageType.BEAUTY_SHOT,
  path: '/path/exterior-2.jpg',
};

const MOCK_IMAGE_INTERIOR_1 = {
  id: 'image-interior-1',
  type: ImageType.BEAUTY_SHOT,
  path: '/path/interior-1.jpg',
};

const MOCK_IMAGE_UNMATCHED = {
  id: 'image-unmatched',
  type: ImageType.BEAUTY_SHOT,
  path: '/path/unmatched.jpg',
};

const MOCK_SIGHT_EXTERIOR_1 = {
  id: MOCK_SIGHT_ID_EXTERIOR_1,
  imageId: MOCK_IMAGE_EXTERIOR_1.id,
};

const MOCK_SIGHT_EXTERIOR_2 = {
  id: MOCK_SIGHT_ID_EXTERIOR_2,
  imageId: MOCK_IMAGE_EXTERIOR_2.id,
};

const MOCK_SIGHT_INTERIOR_1 = {
  id: MOCK_SIGHT_ID_INTERIOR_1,
  imageId: MOCK_IMAGE_INTERIOR_1.id,
};

const MOCK_SIGHT_UNMATCHED = {
  id: MOCK_SIGHT_ID_UNMATCHED,
  imageId: MOCK_IMAGE_UNMATCHED.id,
};

const MOCK_GALLERY_ITEM_EXTERIOR_1: GalleryItem = {
  id: MOCK_IMAGE_EXTERIOR_1.id,
  image: MOCK_IMAGE_EXTERIOR_1,
  sight: MOCK_SIGHT_EXTERIOR_1,
} as unknown as GalleryItem;

const MOCK_GALLERY_ITEM_EXTERIOR_2: GalleryItem = {
  id: MOCK_IMAGE_EXTERIOR_2.id,
  image: MOCK_IMAGE_EXTERIOR_2,
  sight: MOCK_SIGHT_EXTERIOR_2,
} as unknown as GalleryItem;

const MOCK_GALLERY_ITEM_INTERIOR_1: GalleryItem = {
  id: MOCK_IMAGE_INTERIOR_1.id,
  image: MOCK_IMAGE_INTERIOR_1,
  sight: MOCK_SIGHT_INTERIOR_1,
} as unknown as GalleryItem;

const MOCK_GALLERY_ITEM_UNMATCHED: GalleryItem = {
  id: MOCK_IMAGE_UNMATCHED.id,
  image: MOCK_IMAGE_UNMATCHED,
  sight: MOCK_SIGHT_UNMATCHED,
} as unknown as GalleryItem;

const MOCK_ALL_GALLERY_ITEMS: GalleryItem[] = [
  MOCK_GALLERY_ITEM_EXTERIOR_1,
  MOCK_GALLERY_ITEM_EXTERIOR_2,
  MOCK_GALLERY_ITEM_INTERIOR_1,
  MOCK_GALLERY_ITEM_UNMATCHED,
];

const MOCK_SIGHTS_PER_TAB = {
  [TabKeys.Exterior]: [MOCK_SIGHT_ID_EXTERIOR_1, MOCK_SIGHT_ID_EXTERIOR_2],
  [TabKeys.Interior]: [MOCK_SIGHT_ID_INTERIOR_1],
};

const mockSetCurrentGalleryItems = jest.fn();
const mockOnTabChangeListener = jest.fn();

const createMockParams = (overrides?: Partial<TabsStateParams>): TabsStateParams => ({
  allGalleryItems: MOCK_ALL_GALLERY_ITEMS,
  currentGalleryItems: MOCK_ALL_GALLERY_ITEMS,
  setCurrentGalleryItems: mockSetCurrentGalleryItems,
  sightsPerTab: MOCK_SIGHTS_PER_TAB,
  initialTab: TabKeys.Exterior,
  onTabChangeListeners: [mockOnTabChangeListener],
  unmatchedSightsTab: TabKeys.Exterior,
  customTabs: undefined,
  ...overrides,
});

describe('useTabsState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default exterior tab when no initialTab is provided', () => {
      const params = createMockParams({ initialTab: undefined });
      const { result } = renderHook(() => useTabsState(params));

      expect(result.current.activeTab).toBe(TabKeys.Exterior);
    });

    it('should initialize with the provided initialTab', () => {
      const params = createMockParams({ initialTab: TabKeys.Interior });
      const { result } = renderHook(() => useTabsState(params));

      expect(result.current.activeTab).toBe(TabKeys.Interior);
    });

    it('should merge default tabs with custom tabs', () => {
      const CUSTOM_TAB_KEY = 'custom-tab';
      const CustomComponent = () => React.createElement('div', null, 'Custom Tab');
      const customTabs: Record<string, TabContent> = {
        [CUSTOM_TAB_KEY]: CustomComponent,
      };

      const params = createMockParams({ customTabs });
      const { result } = renderHook(() => useTabsState(params));

      expect(result.current.allTabs[TabKeys.Exterior]).toBeDefined();
      expect(result.current.allTabs[TabKeys.Interior]).toBeDefined();
      expect(result.current.allTabs[CUSTOM_TAB_KEY]).toBe(CustomComponent);
    });

    it('should return ActiveTabComponent for valid React component', () => {
      const CustomComponent = () => React.createElement('div', null, 'Custom Tab');
      const params = createMockParams({
        customTabs: {
          [TabKeys.Exterior]: CustomComponent,
        },
      });
      const { result } = renderHook(() => useTabsState(params));

      expect(result.current.ActiveTabComponent).not.toBeNull();
      expect(React.isValidElement(result.current.ActiveTabComponent)).toBe(true);
    });
  });

  describe('tab change behavior', () => {
    it('should update activeTab when onTabChange is called with valid tab', () => {
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      expect(result.current.activeTab).toBe(TabKeys.Interior);
    });

    it('should not update activeTab when onTabChange is called with invalid tab', () => {
      const INVALID_TAB_KEY = 'non-existent-tab';
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));

      const initialTab = result.current.activeTab;

      act(() => {
        result.current.onTabChange(INVALID_TAB_KEY);
      });

      expect(result.current.activeTab).toBe(initialTab);
    });

    it('should call onTabChangeListeners when tab changes', () => {
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      expect(mockOnTabChangeListener).toHaveBeenCalledWith(TabKeys.Interior);
      expect(mockOnTabChangeListener).toHaveBeenCalledTimes(1);
    });

    it('should not call onTabChangeListeners when tab change is invalid', () => {
      const INVALID_TAB_KEY = 'non-existent-tab';
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(INVALID_TAB_KEY);
      });

      expect(mockOnTabChangeListener).not.toHaveBeenCalled();
    });

    it('should handle multiple onTabChangeListeners', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      const params = createMockParams({
        onTabChangeListeners: [mockListener1, mockListener2],
      });
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      expect(mockListener1).toHaveBeenCalledWith(TabKeys.Interior);
      expect(mockListener2).toHaveBeenCalledWith(TabKeys.Interior);
    });

    it('should handle undefined onTabChangeListeners gracefully', () => {
      const params = createMockParams({ onTabChangeListeners: undefined });
      const { result } = renderHook(() => useTabsState(params));

      expect(() => {
        act(() => {
          result.current.onTabChange(TabKeys.Interior);
        });
      }).not.toThrow();

      expect(result.current.activeTab).toBe(TabKeys.Interior);
    });
  });

  describe('tab activation and deactivation callbacks', () => {
    it('should call onActivate callback of the new tab when changing tabs', () => {
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));
      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      expect((defaultTabs[TabKeys.Interior] as TabObject).onActivate).toHaveBeenCalledWith(
        expect.objectContaining({
          currentGalleryItems: MOCK_ALL_GALLERY_ITEMS,
          allGalleryItems: MOCK_ALL_GALLERY_ITEMS,
          setCurrentGalleryItems: mockSetCurrentGalleryItems,
          sights: MOCK_SIGHTS_PER_TAB,
          unmatchedSightsTab: TabKeys.Exterior,
          unmatchedGalleryItems: expect.arrayContaining([MOCK_GALLERY_ITEM_UNMATCHED]),
        }),
      );
    });

    it('should call onDeactivate callback of the previous tab when changing tabs', () => {
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      expect((defaultTabs[TabKeys.Exterior] as TabObject).onDeactivate).toHaveBeenCalledWith(
        expect.objectContaining({
          currentGalleryItems: MOCK_ALL_GALLERY_ITEMS,
          allGalleryItems: MOCK_ALL_GALLERY_ITEMS,
          setCurrentGalleryItems: mockSetCurrentGalleryItems,
          sights: MOCK_SIGHTS_PER_TAB,
          unmatchedSightsTab: TabKeys.Exterior,
          unmatchedGalleryItems: expect.arrayContaining([MOCK_GALLERY_ITEM_UNMATCHED]),
        }),
      );
    });

    it('should not call callbacks when tab has no onActivate or onDeactivate', () => {
      const CUSTOM_TAB_KEY = 'custom-tab-no-callbacks';
      const CustomComponent = () => React.createElement('div', null, 'Custom Tab');
      const params = createMockParams({
        customTabs: {
          [CUSTOM_TAB_KEY]: CustomComponent,
        },
        initialTab: CUSTOM_TAB_KEY,
      });
      const { result } = renderHook(() => useTabsState(params));

      expect(() => {
        act(() => {
          result.current.onTabChange(TabKeys.Exterior);
        });
      }).not.toThrow();
    });
  });

  describe('unmatched gallery items', () => {
    it('should identify unmatched gallery items not in sightsPerTab', () => {
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      const callArgs = ((defaultTabs[TabKeys.Interior] as TabObject).onActivate as jest.Mock).mock
        .calls[0][0];
      expect(callArgs.unmatchedGalleryItems).toHaveLength(1);
      expect(callArgs.unmatchedGalleryItems[0]).toEqual(MOCK_GALLERY_ITEM_UNMATCHED);
    });

    it('should not include matched sights in unmatched gallery items', () => {
      const params = createMockParams();
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      const callArgs = ((defaultTabs[TabKeys.Interior] as TabObject).onActivate as jest.Mock).mock
        .calls[0][0];
      const unmatchedSightIds = callArgs.unmatchedGalleryItems.map(
        (item: GalleryItem) => item.sight?.id,
      );

      expect(unmatchedSightIds).not.toContain(MOCK_SIGHT_ID_EXTERIOR_1);
      expect(unmatchedSightIds).not.toContain(MOCK_SIGHT_ID_EXTERIOR_2);
      expect(unmatchedSightIds).not.toContain(MOCK_SIGHT_ID_INTERIOR_1);
    });

    it('should handle gallery items without sights', () => {
      const GALLERY_ITEM_NO_SIGHT: GalleryItem = {
        id: 'image-no-sight',
        image: {
          id: 'image-no-sight',
          type: ImageType.BEAUTY_SHOT,
          path: '/path/no-sight.jpg',
        },
        sight: undefined,
      } as unknown as GalleryItem;

      const params = createMockParams({
        allGalleryItems: [...MOCK_ALL_GALLERY_ITEMS, GALLERY_ITEM_NO_SIGHT],
      });
      const { result } = renderHook(() => useTabsState(params));

      act(() => {
        result.current.onTabChange(TabKeys.Interior);
      });

      const callArgs = ((defaultTabs[TabKeys.Interior] as TabObject).onActivate as jest.Mock).mock
        .calls[0][0];
      expect(callArgs.unmatchedGalleryItems).toEqual(
        expect.arrayContaining([MOCK_GALLERY_ITEM_UNMATCHED]),
      );
    });
  });
});
