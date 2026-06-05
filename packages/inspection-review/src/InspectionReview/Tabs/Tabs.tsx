import { useMonkTheme } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { styles } from './Tabs.styles';
import { Button } from '@monkvision/common-ui-web';
import { TabKeys } from '../hooks';

export interface TabsProps {
  activeTab: TabKeys;
  onTabChange: (tab: TabKeys) => void;
}

/**
 * The Tabs component that allows users to switch between different inspection review tabs.
 */
export function Tabs({ activeTab, onTabChange }: TabsProps) {
  const { palette } = useMonkTheme();
  const { t } = useTranslation();

  return (
    <div style={styles['container']}>
      {Object.values(TabKeys).map((tab) => (
        <Button
          key={tab}
          style={{
            ...styles['tabButton'],
            backgroundColor: activeTab === tab ? palette.background.dark : '',
          }}
          onClick={() => onTabChange(tab)}
        >
          {activeTab === tab && 'x'}
          {t(`inspectionReview.${tab === TabKeys.Exterior ? 'exterior' : 'interiorTire'}`)}
        </Button>
      ))}
    </div>
  );
}
