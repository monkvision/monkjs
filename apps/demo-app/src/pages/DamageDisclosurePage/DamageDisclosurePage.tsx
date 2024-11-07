import { useTranslation } from 'react-i18next';
import { useMonkAppState } from '@monkvision/common';
import { DamageDisclosure } from '@monkvision/inspection-capture-web';
import { useNavigate } from 'react-router-dom';
import styles from '../PhotoCapturePage/PhotoCapturePage.module.css';
import { Page } from '../pages';

export function DamageDisclosurePage() {
  const { i18n } = useTranslation();
  const { config, authToken, inspectionId, vehicleType } = useMonkAppState({
    requireInspection: true,
  });
  const navigate = useNavigate();

  return (
    <div className={styles['container']}>
      <DamageDisclosure
        apiConfig={{
          authToken,
          apiDomain: config.apiDomain,
          thumbnailDomain: config.thumbnailDomain,
        }}
        inspectionId={inspectionId}
        vehicleType={vehicleType ?? undefined}
        onComplete={() => navigate(Page.PHOTO_CAPTURE)}
        lang={i18n.language}
      />
    </div>
  );
}
