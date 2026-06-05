import { useCallback, useEffect, useState } from 'react';
import { ExteriorTab } from '../ExteriorTab';
import { InteriorTab } from '../InteriorTab';
import { useObjectMemo } from '@monkvision/common';
import { GalleryItem, useInspectionReviewState } from './InspectionReviewProvider';
import { SightCategory } from '@monkvision/types';

/**
 * API provided to tabs upon activation.
 */
export type TabActivationAPI = {
  /**
   * The current gallery items displayed.
   */
  currentGalleryItems: GalleryItem[];
  /**
   * All gallery items available in the inspection review.
   */
  allGalleryItems: GalleryItem[];
  /**
   * Function to update the current gallery items when the tab is activated.
   */
  setCurrentGalleryItems: (items: GalleryItem[]) => void;
};

/**
 * Object representing a tab with optional activation callback.
 */
export type TabObject = {
  /**
   * The component to be rendered for the tab.
   */
  Component: React.FC | React.ReactElement;
  /**
   * Optional callback invoked when the tab is activated to manipulate the gallery items.
   */
  onActivate?: (api: TabActivationAPI) => void;
  /**
   * Optional callback invoked when the tab is deactivated to manipulate the gallery items.
   */
  onDeactivate?: (api: TabActivationAPI) => void;
};

/**
 * Type representing the content of a tab, defined as a React functional component.
 */
export type TabContent = React.FC | React.ReactElement | TabObject;

/**
 * Enumeration of the default tab keys available in the inspection review.
 */
enum TabKeys {
  Exterior = 'Exterior',
  Interior = 'Interior/Tire',
}

/**
 * Default tabs available in the inspection review.
 */
const defaultTabs: Record<string, TabContent> = {
  [TabKeys.Exterior]: {
    Component: ExteriorTab,
    onActivate: ({ setCurrentGalleryItems, allGalleryItems }) => {
      setCurrentGalleryItems(
        allGalleryItems.filter((item) => item.sight.category === SightCategory.EXTERIOR),
      );
    },
  },
  [TabKeys.Interior]: {
    Component: InteriorTab,
    onActivate: ({ setCurrentGalleryItems, allGalleryItems }) => {
      setCurrentGalleryItems(
        allGalleryItems.filter((item) => item.sight.category === SightCategory.INTERIOR),
      );
    },
  },
};

/**
 * Parameters accepted by the useTabsState hook.
 */
export interface TabsStateParams {
  /**
   * The initial tab to be selected when the hook is used.
   */
  initialTab?: string;
  /**
   * Custom tabs to be displayed along with default ones.
   *
   * @default exterior, interior/tire
   */
  customTabs?: Record<string, TabContent>;
}

/**
 * Handle used to manage the state of tabs in the inspection review.
 */
export interface HandleTabState {
  /**
   * The currently active tab key.
   */
  activeTab: string;
  /**
   * Function to change the active tab.
   */
  handleTabChange: (tab: string) => void;
  /**
   * All tabs including default and custom ones.
   */
  allTabs: Record<string, TabContent>;
}

/**
 * Custom hook to manage the state of tabs in the inspection review, allowing for default and custom tab keys.
 */
export function useTabsState(params?: TabsStateParams): HandleTabState {
  const { allGalleryItems, currentGalleryItems, setCurrentGalleryItems } =
    useInspectionReviewState();

  const [hasInitiated, setHasInitiated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(params?.initialTab ?? TabKeys.Exterior);
  const allTabs: Record<string, TabContent> = {
    ...defaultTabs,
    ...params?.customTabs,
  };

  const handleTabChange = useCallback(
    (tab: string) => {
      if (!Object.keys(allTabs).includes(tab)) {
        return;
      }

      if (allTabs[tab] && 'onActivate' in allTabs[tab]) {
        (allTabs[tab] as TabObject).onActivate?.({
          currentGalleryItems,
          allGalleryItems,
          setCurrentGalleryItems,
        });
      }
      if (allTabs[activeTab] && 'onDeactivate' in allTabs[activeTab]) {
        (allTabs[activeTab] as TabObject).onDeactivate?.({
          currentGalleryItems,
          allGalleryItems,
          setCurrentGalleryItems,
        });
      }
      setActiveTab(tab);
    },
    [allTabs, activeTab, allGalleryItems, setCurrentGalleryItems],
  );

  useEffect(() => {
    if (currentGalleryItems.length === 0 && !hasInitiated) {
      handleTabChange(activeTab);
      setHasInitiated(true);
    }
  }, [allGalleryItems, currentGalleryItems]);

  return useObjectMemo({
    allTabs,
    activeTab,
    handleTabChange,
  });
}
