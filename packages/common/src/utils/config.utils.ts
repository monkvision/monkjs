import { CaptureAppConfig, VehicleType } from '@monkvision/types';
import { uniq } from './array.utils';

/**
 * Util function used to extract the list of available vehicle types in a CaptureAppConfig object.
 */
export function getAvailableVehicleTypes(config: CaptureAppConfig): VehicleType[] {
  return (
    config.enableSteeringWheelPosition
      ? uniq([...Object.keys(config.sights.left), ...Object.keys(config.sights.right)])
      : Object.keys(config.sights)
  ) as VehicleType[];
}
