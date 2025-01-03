import { useTranslation } from 'react-i18next';
import styles from './InspectionCompletePage.module.css';

export function InspectionCompletePage() {
  const { t } = useTranslation();

  return <div className={styles['container']}>{t('inspection-complete.thank-message')}</div>;
}
