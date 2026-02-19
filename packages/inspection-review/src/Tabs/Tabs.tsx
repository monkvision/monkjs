import { styles } from './Tabs.styles';
import { Tab } from './Tab/Tab';

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
  return (
    <div style={styles['container']}>
      {allTabs.map((tab, index, array) => (
        <Tab
          key={tab}
          index={index}
          tab={tab}
          tabsCount={array.length}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      ))}
    </div>
  );
}
