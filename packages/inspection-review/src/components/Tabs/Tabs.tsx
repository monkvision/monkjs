import { styles } from './Tabs.styles';
import { Tab } from './Tab/Tab';
import { useInspectionReviewProvider } from '../../hooks';

/**
 * The Tabs component that allows users to switch between different inspection review tabs.
 */
export function Tabs() {
  const { allTabs, activeTab, onTabChange } = useInspectionReviewProvider();

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
