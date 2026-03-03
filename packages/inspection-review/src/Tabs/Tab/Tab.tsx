import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { TabKeys } from '../../types';
import { useTabStyles } from './Tab.styles';
import { HandleTabState } from '../../hooks/useTabsState';

/**
 * Props accepted by the Tab component.
 */
export type TabProps = Pick<HandleTabState, 'activeTab' | 'onTabChange'> & {
  /**
   * The tab's key.
   */
  tab: string;
  /**
   * The index of the tab in the tabs array.
   */
  index: number;
  /**
   * The total number of tabs.
   */
  tabsCount: number;
};

/**
 * The Tab component that represents a single tab in the Tabs component.
 */
export function Tab({ tab, index, tabsCount, activeTab, onTabChange }: TabProps) {
  const { t } = useTranslation();
  const { tabStyle } = useTabStyles({ tabsCount, index, activeTab, tab });

  return (
    <Button
      key={tab}
      onClick={() => onTabChange(tab)}
      icon={activeTab === tab ? 'check' : undefined}
      style={tabStyle}
    >
      {Object.values(TabKeys).includes(tab as TabKeys) ? t(`tabs.${tab}.label`) : tab}
    </Button>
  );
}
