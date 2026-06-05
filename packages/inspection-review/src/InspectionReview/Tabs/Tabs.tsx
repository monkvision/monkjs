import { useMonkTheme } from '@monkvision/common';
import { styles } from './Tabs.styles';
import { Button } from '@monkvision/common-ui-web';

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

  return (
    <div style={styles['container']}>
      {allTabs.map((tab) => (
        <Button
          key={tab}
          style={{
            ...styles['tabButton'],
            backgroundColor: activeTab === tab ? palette.background.dark : '',
          }}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}
