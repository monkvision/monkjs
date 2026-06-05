import { ImageType } from '@monkvision/types';
import { ExteriorTab } from '../components/ExteriorTab';
import { InteriorTab } from '../components/InteriorTab';
import { TabKeys, type GalleryItem, type TabActivationAPI, type TabContent } from '../types';

function getTabGalleryItems({
  allGalleryItems,
  sights,
  tabKey,
  unmatchedGalleryItems,
  unmatchedSightsTab,
}: TabActivationAPI & { tabKey: string }): GalleryItem[] {
  const matchedGalleryItems = sights[tabKey].reduce<GalleryItem[]>((items, sightId) => {
    const sightMatchedGalleryItems = allGalleryItems.filter((item) => item.sight?.id === sightId);
    return [...items, ...sightMatchedGalleryItems];
  }, []);

  if (tabKey === unmatchedSightsTab) {
    return [...matchedGalleryItems, ...unmatchedGalleryItems];
  }

  return matchedGalleryItems;
}

/**
 * Default tabs available in the inspection review.
 */
export const defaultTabs: Record<string, TabContent> = {
  [TabKeys.Exterior]: {
    Component: ExteriorTab,
    onActivate: (api) => {
      const tabGalleryItems: GalleryItem[] = getTabGalleryItems({
        tabKey: TabKeys.Exterior,
        ...api,
      });
      const closeUpGalleryItems = api.allGalleryItems.filter(
        (item) => item.image.type === ImageType.CLOSE_UP,
      );
      api.setCurrentGalleryItems([...closeUpGalleryItems, ...tabGalleryItems]);
    },
  },
  [TabKeys.Interior]: {
    Component: InteriorTab,
    onActivate: (api) => {
      const tabGalleryItems: GalleryItem[] = getTabGalleryItems({
        tabKey: TabKeys.Interior,
        ...api,
      });
      api.setCurrentGalleryItems(tabGalleryItems);
    },
  },
};
