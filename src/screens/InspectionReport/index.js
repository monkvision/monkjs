import ExpoConstants from 'expo-constants';
import React, { useMemo } from 'react';
import { DamageMode, DamageReport } from '@monkvision/inspection-report';
import { useRoute } from '@react-navigation/native';

const damageMode = DamageMode.ALL;

export default function InspectionReport() {
  const route = useRoute();
  const { inspectionId, vehicleType } = route.params;
  const pdfOptions = useMemo(() => ({
    customer: ExpoConstants.manifest.extra.PDF_REPORT_CUSTOMER,
    clientName: ExpoConstants.manifest.extra.PDF_REPORT_CLIENT_NAME,
  }), []);

  return (
    <DamageReport
      inspectionId={inspectionId}
      damageMode={damageMode}
      vehicleType={vehicleType}
      generatePdf
      pdfOptions={pdfOptions}
    />
  );
}

InspectionReport.propTypes = {};

InspectionReport.defaultProps = {};
