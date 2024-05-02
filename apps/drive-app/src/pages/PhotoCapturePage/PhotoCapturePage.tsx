import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { getEnvOrThrow, useMonkAppParams, useSearchParams } from '@monkvision/common';
import { DeviceOrientation, Sight, TaskName } from '@monkvision/types';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { useNavigate } from 'react-router-dom';
import { getSights } from '../../config';
import styles from './PhotoCapturePage.module.css';
import { Page } from '../pages';

function getTasksBySight(sights: Sight[]): Record<string, TaskName[]> {
  return sights.reduce(
    (tasksBySight, sight) => ({
      ...tasksBySight,
      [sight.id]: [...sight.tasks, TaskName.HUMAN_IN_THE_LOOP],
    }),
    {},
  );
}

export function PhotoCapturePage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { authToken, inspectionId, vehicleType, steeringWheel } = useMonkAppParams({
    required: true,
  });
  const sights = useMemo(() => getSights(vehicleType, steeringWheel), [vehicleType, steeringWheel]);
  const tasksBySight = useMemo(() => getTasksBySight(sights), [sights]);
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
        tasksBySight={tasksBySight}
        onComplete={handleComplete}
        lang={i18n.language}
        enforceOrientation={DeviceOrientation.LANDSCAPE}
        allowSkipRetake={true}
        useLiveCompliance={true}
        enableAddDamage={false}
      />
    </div>
  );
}
