import { useTranslation } from 'react-i18next';
import {
  getEnvOrThrow,
  useMonkAppParams,
  zlibCompress,
  getSearchParamFromVehicleType,
} from '@monkvision/common';
import { VehicleType } from '@monkvision/types';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { getSights } from '../../config';
import styles from './PhotoCapturePage.module.css';

function createInspectionReportLink(
  authToken: string | null,
  inspectionId: string | null,
  language: string,
  vehicleType: VehicleType | null,
): string {
  const url = getEnvOrThrow('REACT_APP_INSPECTION_REPORT_URL');
  const token = encodeURIComponent(zlibCompress(authToken ?? ''));
  const vType = getSearchParamFromVehicleType(vehicleType);
  return `${url}?c=e5j&lang=${language}&i=${inspectionId}&t=${token}&v=${vType}`;
}

export function PhotoCapturePage() {
  const { i18n } = useTranslation();
  const { authToken, inspectionId, vehicleType } = useMonkAppParams({ required: true });

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
        apiConfig={{ authToken, apiDomain: getEnvOrThrow('REACT_APP_API_DOMAIN') }}
        inspectionId={inspectionId}
        sights={getSights(vehicleType)}
        onComplete={handleComplete}
      />
    </div>
  );
}
