import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMonkAppState } from '@monkvision/common';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import styles from './PhotoCapturePage.module.css';
import { createInspectionReportLink } from './inspectionReport';

export function PhotoCapturePage() {
  const { i18n } = useTranslation();
  const { config, authToken, inspectionId, vehicleType, getCurrentSights } = useMonkAppState({
    requireInspection: true,
  });
  const currentSights = useMemo(() => getCurrentSights(), [getCurrentSights]);

  const handleComplete = () => {
    window.location.href = createInspectionReportLink(
      authToken,
      inspectionId,
      i18n.language,
      vehicleType,
    );
  };

  return (
    <div className={styles['container']}>
      <PhotoCapture
        {...config}
        apiConfig={{ authToken, apiDomain: config.apiDomain }}
        inspectionId={inspectionId}
        sights={currentSights}
        onComplete={handleComplete}
        lang={i18n.language}
      />
    </div>
  );
}
