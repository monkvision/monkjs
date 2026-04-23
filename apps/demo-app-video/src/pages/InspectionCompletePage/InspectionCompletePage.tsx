import { useTranslation } from 'react-i18next';
import { CaptureWorkflow } from '@monkvision/types';
import { useMonkAppState } from '@monkvision/common';
import styles from './InspectionCompletePage.module.css';

export function InspectionCompletePage() {
  const { inspectionId } = useMonkAppState({
    requireInspection: true,
    requireWorkflow: CaptureWorkflow.VIDEO,
  });
  const { t } = useTranslation();

  return (
    <div className={styles['container']}>
      <div className={styles['label']}>{t('inspection-complete.thank-message')}</div>
      <div className={styles['sublabel']}>{`id: ${inspectionId}`}</div>
    </div>
  );
}
