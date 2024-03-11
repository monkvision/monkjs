import { DependencyList, useEffect, useState } from 'react';
import { useMonitoring } from '@monkvision/monitoring';
import { decodeMonkJwt } from '@monkvision/network';
import {
  InspectionTransaction,
  InternalPhotoCaptureMonitoringConfig,
  PhotoCaptureMonitoringConfig,
} from '../monitoring';

export interface UsePhotoCaptureMonitoringParams {
  inspectionId: string;
  /**
   * The authentication token used to communicate with the API.
   */
  authToken: string;
  /**
   * The optional custom monitoring configuration that can be passed to the PhotoCapture component.
   */
  monitoring?: PhotoCaptureMonitoringConfig;
  /**
   * Optional list of dependencies to trigger the effect on changes.
   */
  deps?: DependencyList;
}

export function usePhotoCaptureMonitoring({
  inspectionId,
  authToken,
  monitoring,
  deps,
}: UsePhotoCaptureMonitoringParams): InternalPhotoCaptureMonitoringConfig | undefined {
  const [inspectionMonitoring, setInspectionMonitoring] =
    useState<InternalPhotoCaptureMonitoringConfig>();
  const { setUserId, createTransaction } = useMonitoring();

  useEffect(() => {
    const jwtPayload = decodeMonkJwt(authToken);
    if (jwtPayload && jwtPayload.azp) {
      setUserId(jwtPayload.azp);
    }
    const transaction = createTransaction({ ...InspectionTransaction, ...monitoring });
    transaction.setTag('inspectionId', inspectionId);
    const childMonitoring: InternalPhotoCaptureMonitoringConfig = {
      transaction,
      data: monitoring?.data,
      tags: { ...monitoring?.tags, inspectionId },
    };
    setInspectionMonitoring(childMonitoring);
  }, deps);
  return inspectionMonitoring;
}
