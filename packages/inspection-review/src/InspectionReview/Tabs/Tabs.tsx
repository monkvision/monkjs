import { useTranslation } from 'react-i18next';
import { useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { styles } from './Tabs.styles';
import { TabKeys } from '../types';

/**
 * Props accepted by the Tabs component.
 */
export interface TabsProps {
  /**
   * All tabs including default and custom ones.
   */
  allTabs: string[];
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
 * The Tabs component that allows users to switch between different inspection review tabs.
 */
export function Tabs({ allTabs, activeTab, onTabChange }: TabsProps) {
  const { palette } = useMonkTheme();
  const { t } = useTranslation();

  const getTabStyle = (index: number, arrayLength: number) => {
    if (index === 0) {
      return styles['firstButton'];
    }
    if (index === arrayLength - 1) {
      return styles['lastButton'];
    }

    return styles['middleButton'];
  };

  return (
    <div style={styles['container']}>
      {allTabs.map((tab, index, array) => (
        <Button
          key={tab}
          onClick={() => onTabChange(tab)}
          icon={activeTab === tab ? 'check' : undefined}
          style={{
            ...styles['tabButton'],
            ...getTabStyle(index, array.length),
            backgroundColor: activeTab === tab ? palette.background.dark : '',
            color: activeTab === tab ? palette.text.white : '',
          }}
        >
          {Object.values(TabKeys).includes(tab as TabKeys) ? t(`tabs.${tab}.label`) : tab}
        </Button>
      ))}
    </div>
  );
}
