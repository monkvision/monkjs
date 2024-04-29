import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { getEnvOrThrow, useMonkAppParams } from '@monkvision/common';
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
  const { authToken, inspectionId, vehicleType } = useMonkAppParams({ required: true });
  const sights = getSights(vehicleType);
  const tasksBySight = useMemo(() => getTasksBySight(sights), [vehicleType]);

  const handleComplete = () => {
    navigate(Page.INSPECTION_COMPLETE);
  };

  return (
    <div className={styles['container']}>
      <PhotoCapture
        apiConfig={{ authToken, apiDomain: getEnvOrThrow('REACT_APP_API_DOMAIN') }}
        inspectionId={inspectionId}
        sights={getSights(vehicleType)}
        tasksBySight={tasksBySight}
        onComplete={handleComplete}
        lang={i18n.language}
        enforceOrientation={DeviceOrientation.LANDSCAPE}
        allowSkipRetake={false}
        useLiveCompliance={true}
      />
    </div>
  );
}
