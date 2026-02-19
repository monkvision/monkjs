import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { InspectionReviewProps, TabContent, TabKeys, TabObject } from '../types';
import type { InspectionReviewProviderState } from '../types/inspection-review.types';
import { defaultTabs } from '../config';

/**
 * Parameters accepted by the useTabsState hook.
 */
export interface TabsStateParams
  extends Pick<InspectionReviewProps, 'customTabs'>,
    Pick<
      InspectionReviewProviderState,
      | 'allGalleryItems'
      | 'currentGalleryItems'
      | 'setCurrentGalleryItems'
      | 'inspection'
      | 'sightsPerTab'
    > {
  /**
   * The initial tab to be selected when the hook is used.
   */
  initialTab?: string;
  /**
   * Array of event listeners to be called when the tab changes.
   * Each listener receives the new tab key as a parameter.
   */
  onTabChangeListeners?: Array<(tab: string) => void>;
}

/**
 * Handle used to manage the state of tabs in the inspection review.
 */
export interface HandleTabState
  extends Pick<
    InspectionReviewProviderState,
    'allTabs' | 'activeTab' | 'ActiveTabComponent' | 'onTabChange'
  > {}

/**
 * Custom hook to manage the state of tabs in the inspection review, allowing for default and custom tab keys.
 */
export function useTabsState(params: TabsStateParams): HandleTabState {
  const {
    currentGalleryItems,
    allGalleryItems,
    setCurrentGalleryItems,
    inspection,
    sightsPerTab,
    initialTab,
    onTabChangeListeners,
  } = params;
  const [isTabsStateLoaded, setIsTabsStateInitiated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>(initialTab ?? TabKeys.Exterior);
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

      onTabChangeListeners?.forEach((listener) => {
        listener(tab);
      });
    },
    [allTabs, activeTab, allGalleryItems, onTabChangeListeners],
  );

  // Initialize the first tab on inspection load
  useEffect(() => {
    if (inspection && !isTabsStateLoaded) {
      handleTabChange(activeTab);
      setIsTabsStateInitiated(true);
    }
  }, [inspection]);

  return useObjectMemo({
    allTabs,
    activeTab,
    onTabChange: handleTabChange,
    ActiveTabComponent,
  });
}
