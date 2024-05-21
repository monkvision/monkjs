import { useTranslation } from 'react-i18next';
import { getEnvOrThrow, useMonkApplicationState, zlibCompress } from '@monkvision/common';
import { DeviceOrientation, VehicleType } from '@monkvision/types';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { getSights, complianceIssues } from '../../config';
import styles from './PhotoCapturePage.module.css';

function getSearchParamFromVehicleType(vehicleType: VehicleType | null): string {
  switch (vehicleType) {
    case VehicleType.SUV:
      return '0';
    case VehicleType.CROSSOVER:
      return '1';
    case VehicleType.SEDAN:
      return '2';
    case VehicleType.HATCHBACK:
      return '3';
    case VehicleType.VAN:
      return '4';
    case VehicleType.MINIVAN:
      return '5';
    case VehicleType.PICKUP:
      return '6';
    default:
      return '1';
  }
}

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
  const { authToken, inspectionId, vehicleType } = useMonkApplicationState({ required: true });

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
        lang={i18n.language}
        enforceOrientation={DeviceOrientation.LANDSCAPE}
        allowSkipRetake={true}
        useLiveCompliance={true}
        complianceIssues={complianceIssues}
      />
    </div>
  );
}
