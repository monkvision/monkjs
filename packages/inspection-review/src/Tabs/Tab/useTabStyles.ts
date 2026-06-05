import { useMonkTheme } from '@monkvision/common';
import { useMemo } from 'react';
import { styles } from './Tab.styles';

/**
 * Parameters accepted by the useTabStyles hook.
 */
export interface TabStylesProps {
  /**
   * The index of the tab in the tabs array.
   */
  index: number;
  /**
   * The currently active tab key.
   */
  activeTab: string;
  /**
   * The tab key.
   */
  tab: string;
  /**
   * The total number of tabs.
   */
  tabsCount: number;
}

/**
 * Hook to get styles for a Tab.
 */
export function useTabStyles({ tabsCount, index, activeTab, tab }: TabStylesProps) {
  const { palette } = useMonkTheme();

  const tabStyle = useMemo(() => {
    if (index === 0) {
      return styles['firstTab'];
    }
    if (index === tabsCount - 1) {
      return styles['lastTab'];
    }

    return styles['middleTab'];
  }, [tab, activeTab, tabsCount, index]);

  return {
    tabStyle: {
      ...tabStyle,
      backgroundColor: activeTab === tab ? palette.background.dark : '',
      color: activeTab === tab ? palette.text.white : '',
    },
  };
}
