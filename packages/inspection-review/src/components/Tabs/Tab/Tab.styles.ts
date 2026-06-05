import { useMemo } from 'react';
import { Styles } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';

export const styles: Styles = {
  tab: {
    color: 'black',
    width: '200px',
    borderColor: 'rgb(206, 212, 218)',
  },
  firstTab: {
    borderWidth: '1px 0px 1px 1px',
    borderRadius: '99px 0px 0px 99px',
  },
  middleTab: {
    borderWidth: '1px 0px 1px 0px',
    borderRadius: '0px',
  },
  lastTab: {
    borderWidth: '1px 1px 1px 1px',
    borderRadius: '0px 99px 99px 0px',
  },
};

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
      return {
        ...styles['tab'],
        ...styles['firstTab'],
      };
    }
    if (index === tabsCount - 1) {
      return {
        ...styles['tab'],
        ...styles['lastTab'],
      };
    }

    return {
      ...styles['tab'],
      ...styles['middleTab'],
    };
  }, [tab, activeTab, tabsCount, index]);

  return {
    tabStyle: {
      ...tabStyle,
      backgroundColor: activeTab === tab ? palette.background.dark : palette.background.light,
      color: palette.text.primary,
    },
  };
}
