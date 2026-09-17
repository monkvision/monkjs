import { useCallback } from 'react';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { MileageUnit } from '@monkvision/types';
import { parseOdometerText } from '../PhotoCaptureHUD/OcrOverlay/PhotoCaptureHUDOcrText.utils';
import { OcrMode } from './ocrTypes';

export interface UsePhotoCaptureOcrConfirmParams {
  /** ID of the inspection this OCR reading will be stored against. */
  inspectionId: string;
  /** API configuration (auth token, base URL, etc.). */
  apiConfig: MonkApiConfig;
}

export interface UsePhotoCaptureOcrConfirmResult {
  /**
   * Sends the confirmed OCR reading to the Monk API.
   * - `'odometer'`: parses the mileage value and unit, then calls `updateInspectionVehicle`.
   * - `'vin'`: calls `updateInspectionVehicle` with the raw VIN string.
   * No-ops when `mode` is undefined or the odometer value cannot be parsed.
   */
  handleOcrConfirm: (
    text: string,
    mode: OcrMode | undefined,
    defaultMileageUnit: MileageUnit | undefined,
  ) => void;
}

/**
 * Handles the side-effects triggered when the user confirms an OCR reading:
 * - `'odometer'` mode: parses the mileage value and unit, then calls updateInspectionVehicle.
 * - `'vin'` mode: calls updateInspectionVehicle with the confirmed VIN string.
 */
export function usePhotoCaptureOcrConfirm({
  inspectionId,
  apiConfig,
}: UsePhotoCaptureOcrConfirmParams): UsePhotoCaptureOcrConfirmResult {
  const { updateInspectionVehicle } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  const handleOcrConfirm = useCallback(
    (text: string, mode: OcrMode | undefined, defaultMileageUnit: MileageUnit | undefined) => {
      if (!mode) {
        return;
      }

      if (mode === 'odometer') {
        const { value, unit } = parseOdometerText(text);
        if (value === null) {
          return;
        }
        updateInspectionVehicle({
          inspectionId,
          vehicle: {
            mileageValue: value,
            mileageUnit: unit ?? defaultMileageUnit ?? MileageUnit.KM,
          },
        }).catch(handleError);
      }

      if (mode === 'vin') {
        updateInspectionVehicle({
          inspectionId,
          vehicle: { vin: text },
        }).catch(handleError);
      }
    },
    [inspectionId, updateInspectionVehicle, handleError],
  );

  return { handleOcrConfirm };
}
