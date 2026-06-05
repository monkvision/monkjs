import { useMemo, useState } from 'react';
import { ActiveTab } from '../ActiveTab';

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
  initialTab?: string;
  /**
   * Custom tabs to be displayed along with default ones.
   *
   * @default exterior, interior/tire
   */
  customTabs?: Record<string, React.ReactNode>;
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
  allTabs: Record<string, React.ReactNode>;
}

/**
 * Custom hook to manage the state of tabs in the inspection review, allowing for default and custom tab keys.
 */
export function useTabsState(params?: TabsStateParams): HandleTabState {
  const allTabs: Record<string, React.ReactNode> = useMemo(
    () => ({
      [TabKeys.Exterior]: ActiveTab,
      [TabKeys.Interior]: ActiveTab,
      ...params?.customTabs,
    }),
    [params?.customTabs],
  );

  const [activeTab, setActiveTab] = useState<string>(params?.initialTab ?? TabKeys.Exterior);

  const handleTabChange = (tab: string) => {
    if (Object.keys(allTabs).includes(tab)) {
      setActiveTab(tab);
    }
  };

  return {
    allTabs,
    activeTab,
    handleTabChange,
  };
}
