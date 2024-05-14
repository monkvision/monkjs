import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { getEnvOrThrow, useMonkApplicationState, useSearchParams } from '@monkvision/common';
import { DeviceOrientation } from '@monkvision/types';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useNavigate } from 'react-router-dom';
import { complianceIssuesPerSight, getSights, getTasksBySight } from '../../config';
import styles from './PhotoCapturePage.module.css';
import { Page } from '../pages';

export function PhotoCapturePage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { authToken, inspectionId, vehicleType, steeringWheel } = useMonkApplicationState({
    required: true,
  });
  const sights = useMemo(() => getSights(vehicleType, steeringWheel), [vehicleType, steeringWheel]);
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
        apiConfig={{ authToken, apiDomain: getEnvOrThrow('REACT_APP_API_DOMAIN') }}
        inspectionId={inspectionId}
        sights={sights}
        tasksBySight={getTasksBySight(sights)}
        onComplete={handleComplete}
        lang={i18n.language}
        enforceOrientation={DeviceOrientation.LANDSCAPE}
        allowSkipRetake={true}
        useLiveCompliance={true}
        enableAddDamage={false}
        complianceIssuesPerSight={complianceIssuesPerSight}
      />
    </div>
  );
}
