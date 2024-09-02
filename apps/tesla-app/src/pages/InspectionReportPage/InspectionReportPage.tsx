import { useMonkAppState } from '@monkvision/common';
import { InspectionReport } from './InspectionReport/InspectionReport';

export function InspectionReportPage() {
  const { config, authToken, inspectionId, vehicleType, getCurrentSights } = useMonkAppState({
    requireInspection: true,
  });

  const apiConfig = {
    authToken,
    apiDomain: config.apiDomain,
    thumbnailDomain: config.thumbnailDomain,
  };

  return <InspectionReport inspectionId={inspectionId} apiConfig={apiConfig} />;
}
