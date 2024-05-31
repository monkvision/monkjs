import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useMonkAppState, useSearchParams } from '@monkvision/common';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useNavigate } from 'react-router-dom';
import styles from './PhotoCapturePage.module.css';
import { Page } from '../pages';

export function PhotoCapturePage() {
  const { i18n } = useTranslation();
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
        apiConfig={{ authToken, apiDomain: config.apiDomain }}
        inspectionId={inspectionId}
        sights={currentSights}
        onComplete={handleComplete}
        lang={i18n.language}
        resolution={config.resolution}
        allowImageUpscaling={config.allowImageUpscaling}
        format={config.format}
        quality={config.quality}
        tasksBySight={config.tasksBySight}
        startTasksOnComplete={config.startTasksOnComplete}
        showCloseButton={config.showCloseButton}
        enforceOrientation={config.enforceOrientation}
        allowSkipRetake={config.allowSkipRetake}
        enableAddDamage={config.enableAddDamage}
        enableCompliance={config.enableCompliance}
        enableCompliancePerSight={config.enableCompliancePerSight}
        complianceIssues={config.complianceIssues}
        complianceIssuesPerSight={config.complianceIssuesPerSight}
        useLiveCompliance={config.useLiveCompliance}
        customComplianceThresholds={config.customComplianceThresholds}
        customComplianceThresholdsPerSight={config.customComplianceThresholdsPerSight}
      />
    </div>
  );
}
