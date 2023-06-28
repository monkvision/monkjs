import React, { useMemo } from 'react';
import ExpoConstants from 'expo-constants';
import { DamageMode, DamageReport } from '@monkvision/inspection-report';
import { useRoute, useNavigation } from '@react-navigation/native';

import * as names from 'screens/names';

const damageMode = DamageMode.ALL;

export default function InspectionReport() {
  const route = useRoute();
  const { inspectionId, vehicleType } = route.params;
  const pdfOptions = useMemo(() => ({
    customer: ExpoConstants.manifest.extra.PDF_REPORT_CUSTOMER,
    clientName: ExpoConstants.manifest.extra.PDF_REPORT_CLIENT_NAME,
  }), []);
  const navigation = useNavigation();

  return (
    <DamageReport
      inspectionId={inspectionId}
      damageMode={damageMode}
      vehicleType={vehicleType}
      generatePdf
      pdfOptions={pdfOptions}
      onStartNewInspection={() => navigation.navigate(names.LANDING)}
    />
  );
}

InspectionReport.propTypes = {};

InspectionReport.defaultProps = {};
