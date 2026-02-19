import { useState } from 'react';

/**
 * Enumeration of the default tab keys available in the inspection review.
 */
export enum TabKeys {
  Exterior = 'Exterior',
  Interior = 'Interior/Tire',
}

export interface TabsStateParams {
  /**
   * The initial tab to be selected when the hook is used.
   */
  initialTab?: TabKeys;
  /**
   * Up to 2 custom tab keys to be added alongside the default tabs.
   */
  additionalTabs?: [string?, string?];
}

/**
 * Handle used to manage the state of tabs in the inspection review.
 */
export interface HandleTabState {
  /**
   * The currently active tab key.
   */
  activeTab: TabKeys;
  /**
   * Function to change the active tab.
   */
  handleTabChange: (tab: TabKeys) => void;
}

/**
 * Custom hook to manage the state of tabs in the inspection review, allowing for default and custom tab keys.
 */
export function useTabsState(params?: TabsStateParams): HandleTabState {
  const [activeTab, setActiveTab] = useState<TabKeys>(params?.initialTab ?? TabKeys.Exterior);

  const handleTabChange = (tab: TabKeys) => {
    if (Object.values(TabKeys).includes(tab)) {
      setActiveTab(tab);
    }
  };

  return {
    activeTab,
    handleTabChange,
  };
}
