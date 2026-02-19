import { styles } from './Tabs.styles';
import { Tab } from './Tab/Tab';
import { HandleTabState } from '../hooks/useTabsState';

/**
 * Props accepted by the Tabs component.
 */
export type TabsProps = Pick<HandleTabState, 'allTabs' | 'activeTab' | 'onTabChange'>;

/**
 * The Tabs component that allows users to switch between different inspection review tabs.
 */
export function Tabs({ allTabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div style={styles['container']}>
      {Object.keys(allTabs).map((tab, index, array) => (
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
