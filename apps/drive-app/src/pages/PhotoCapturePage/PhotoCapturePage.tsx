import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useMonkAppState, useSearchParams } from '@monkvision/common';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useNavigate } from 'react-router-dom';
import styles from './PhotoCapturePage.module.css';
import { Page } from '../pages';

export function PhotoCapturePage() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { config, authToken, inspectionId, getCurrentSights } = useMonkAppState({
    requireInspection: true,
  });
  const currentSights = useMemo(() => getCurrentSights(), [getCurrentSights]);
  const searchParams = useSearchParams();

  const handleComplete = () => {
    const redirectUrl = searchParams.get('r');
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }
    navigate(Page.INSPECTION_COMPLETE);
  };

  return (
    <div className={styles['container']}>
      <PhotoCapture
        {...config}
        apiConfig={{ authToken, apiDomain: config.apiDomain }}
        inspectionId={inspectionId}
        onComplete={handleComplete}
        lang={i18n.language}
        sights={currentSights}
        validateButtonLabel={t('photo-capture.validate-label')}
      />
    </div>
  );
}
