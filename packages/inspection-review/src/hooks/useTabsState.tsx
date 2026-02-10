import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';

import { useInspectionReviewState } from './InspectionReviewProvider';
import { TabContent, TabKeys, TabObject } from '../types';
import { defaultTabs } from '../utils/tabs.utils';

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
   * Tabs list including default and custom ones.
   */
  allTabs: Record<string, TabContent>;
  /**
   * The component of the currently active tab ready to be rendered.
   */
  ActiveTabComponent: React.FC | React.ReactElement | null;
  /**
   * Function to change the active tab.
   */
  handleTabChange: (tab: string) => void;
}

/**
 * Custom hook to manage the state of tabs in the inspection review, allowing for default and custom tab keys.
 */
export function useTabsState(params?: TabsStateParams): HandleTabState {
  const { allGalleryItems, currentGalleryItems, sightsPerTab, setCurrentGalleryItems } =
    useInspectionReviewState();

  const [hasInitiated, setHasInitiated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(params?.initialTab ?? TabKeys.Exterior);
  const allTabs: Record<string, TabContent> = {
    ...defaultTabs,
    ...params?.customTabs,
  };

  const ActiveTabComponent = useMemo((): React.FC | React.ReactElement | null => {
    const activeTabContent = allTabs[activeTab];
    let tabComponent = activeTabContent;

    if ('Component' in activeTabContent) {
      tabComponent = activeTabContent.Component;
    }
    if (React.isValidElement(tabComponent)) {
      return tabComponent;
    }
    if (typeof tabComponent === 'function') {
      return React.createElement(tabComponent);
    }

    return null;
  }, [activeTab, allTabs]);

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
          sights: sightsPerTab,
        });
      }
      if (allTabs[activeTab] && 'onDeactivate' in allTabs[activeTab]) {
        (allTabs[activeTab] as TabObject).onDeactivate?.({
          currentGalleryItems,
          allGalleryItems,
          setCurrentGalleryItems,
          sights: sightsPerTab,
        });
      }
      setActiveTab(tab);
    },
    [allTabs, activeTab, allGalleryItems],
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
    ActiveTabComponent,
  });
}
