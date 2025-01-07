import { useTranslation } from 'react-i18next';
import { useMonkAppState } from '@monkvision/common';
import { DamageDisclosure } from '@monkvision/inspection-capture-web';
import { useNavigate } from 'react-router-dom';
import styles from './DamageDisclosurePage.module.css';
import { Page } from '../pages';

export function DamageDisclosurePage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { config, authToken, inspectionId } = useMonkAppState({
    requireInspection: true,
  });

  return (
    <div className={styles['container']}>
      <DamageDisclosure
        {...config}
        apiConfig={{
          authToken,
          apiDomain: config.apiDomain,
          thumbnailDomain: config.thumbnailDomain,
        }}
        inspectionId={inspectionId}
        onComplete={() => navigate(Page.PHOTO_CAPTURE)}
        lang={i18n.language}
      />
    </div>
  );
}
