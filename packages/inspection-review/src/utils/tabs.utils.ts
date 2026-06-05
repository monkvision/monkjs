import { ImageType } from '@monkvision/types';
import { ExteriorTab } from '../ExteriorTab';
import { InteriorTab } from '../InteriorTab';
import { GalleryItem, TabContent, TabKeys } from '../types';

function getTabGalleryItems(
  allGalleryItems: GalleryItem[],
  tabKey: TabKeys.Exterior | string,
  sights: Record<string, string[]>,
): GalleryItem[] {
  return sights[tabKey].reduce<GalleryItem[]>((items, sightId) => {
    const sightItems = allGalleryItems.filter((item) => item.sight?.id === sightId);
    return [...items, ...sightItems];
  }, []);
}

/**
 * Default tabs available in the inspection review.
 */
export const defaultTabs: Record<string, TabContent> = {
  [TabKeys.Exterior]: {
    Component: ExteriorTab,
    onActivate: ({ setCurrentGalleryItems, allGalleryItems, sights }) => {
      const tabItems: GalleryItem[] = getTabGalleryItems(allGalleryItems, TabKeys.Exterior, sights);
      const closeUpItems = allGalleryItems.filter((item) => item.image.type === ImageType.CLOSE_UP);
      setCurrentGalleryItems([...closeUpItems, ...tabItems]);
    },
  },
  [TabKeys.Interior]: {
    Component: InteriorTab,
    onActivate: ({ setCurrentGalleryItems, allGalleryItems, sights }) => {
      const tabItems: GalleryItem[] = getTabGalleryItems(allGalleryItems, TabKeys.Interior, sights);
      setCurrentGalleryItems(tabItems);
    },
  },
};
