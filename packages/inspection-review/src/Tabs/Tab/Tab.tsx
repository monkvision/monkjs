import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { TabKeys } from '../../types';
import { useTabStyles } from './useTabStyles';

/**
 * Props accepted by the Tab component.
 */
interface TabsProps {
  /**
   * The tab key.
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
  /**
   * The currently active tab key.
   */
  activeTab: string;
  /**
   * Callback function to handle tab changes.
   */
  onTabChange: (tab: string) => void;
}

/**
 * The Tab component that represents a single tab in the Tabs component.
 */
export function Tab({ tab, index, tabsCount, activeTab, onTabChange }: TabsProps) {
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
