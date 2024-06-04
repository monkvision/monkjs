import { VehicleType } from '@monkvision/types';
import { getEnvOrThrow, zlibCompress } from '@monkvision/common';

function getSearchParamFromVehicleType(vehicleType: VehicleType | null): string {
  switch (vehicleType) {
    case VehicleType.SUV:
      return '0';
    case VehicleType.CUV:
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

export function createInspectionReportLink(
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
