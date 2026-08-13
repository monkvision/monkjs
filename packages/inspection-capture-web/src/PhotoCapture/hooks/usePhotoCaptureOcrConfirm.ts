import { useCallback } from 'react';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { MileageUnit } from '@monkvision/types';
import { parseOdometerText } from '../PhotoCaptureHUD/OcrOverlay/ocrText.utils';
import { OcrMode } from './usePhotoCaptureOcr';

export interface UsePhotoCaptureOcrConfirmParams {
  inspectionId: string;
  apiConfig: MonkApiConfig;
}

export interface UsePhotoCaptureOcrConfirmResult {
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

  const handleOcrConfirm = useCallback(
    (text: string, mode: OcrMode | undefined, defaultMileageUnit: MileageUnit | undefined) => {
      // eslint-disable-next-line no-console
      console.log('[OCR] handleOcrVehicleUpdate called', { text, mode, defaultMileageUnit });
      if (!mode) {
        return;
      }

      if (mode === 'odometer') {
        const { value, unit } = parseOdometerText(text);
        // eslint-disable-next-line no-console
        console.log('[OCR] odometer parsed', { value, unit, defaultMileageUnit });
        if (value === null) {
          return;
        }
        updateInspectionVehicle({
          inspectionId,
          vehicle: {
            mileageValue: value,
            mileageUnit: unit ?? defaultMileageUnit ?? MileageUnit.KM,
          },
        })
          .then((res) => {
            // eslint-disable-next-line no-console
            console.log('[OCR] updateInspectionVehicle success', res);
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('[OCR] updateInspectionVehicle error', err);
          });
      }

      if (mode === 'vin') {
        updateInspectionVehicle({
          inspectionId,
          vehicle: { vin: text },
        })
          .then((res) => {
            // eslint-disable-next-line no-console
            console.log('[OCR] updateInspectionVehicle (vin) success', res);
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('[OCR] updateInspectionVehicle (vin) error', err);
          });
      }
    },
    [inspectionId, updateInspectionVehicle],
  );

  return { handleOcrConfirm };
}
