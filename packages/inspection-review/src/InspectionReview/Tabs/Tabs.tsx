import { useMonkTheme } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { styles } from './Tabs.styles';
import { Button } from '@monkvision/common-ui-web';
import { useState } from 'react';

export enum ViewMode {
  INTERIOR = 'interior',
  EXTERIOR = 'exterior',
}

export function Tabs() {
  const { palette } = useMonkTheme();
  const { t } = useTranslation();
  const [mode, setMode] = useState<ViewMode>(ViewMode.EXTERIOR);

  const onTabChange = (mode: ViewMode) => {
    setMode(mode);
  };

  return (
    <div style={styles['container']}>
      <Button
        style={{
          ...styles['exteriorButton'],
          backgroundColor: mode === ViewMode.EXTERIOR ? palette.background.dark : '',
        }}
        onClick={() => onTabChange(ViewMode.EXTERIOR)}
      >
        {mode === ViewMode.EXTERIOR && 'x'}
        {t('inspectionReview.exterior')}
      </Button>
      <Button
        style={{
          ...styles['interiorButton'],
          backgroundColor: mode === ViewMode.INTERIOR ? palette.background.dark : '',
        }}
        onClick={() => onTabChange(ViewMode.INTERIOR)}
      >
        {mode === ViewMode.INTERIOR && 'x'}
        {t('inspectionReview.interiorTire')}
      </Button>
    </div>
  );
}
