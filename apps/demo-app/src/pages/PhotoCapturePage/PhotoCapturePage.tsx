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
        maxUploadDurationWarning={config.maxUploadDurationWarning}
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
