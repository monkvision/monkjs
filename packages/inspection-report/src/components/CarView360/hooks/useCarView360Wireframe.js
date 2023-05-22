import { useMemo } from 'react';
import { PartSelectorOverlays } from '@monkvision/sights/dist/partSelectors';

import { CarOrientation, VehicleType } from '../../../resources';

const VEHICLE_MODEL_MAP = {
  [VehicleType.SUV]: 'jgc21',
  [VehicleType.CUV]: 'fesc20',
  [VehicleType.SEDAN]: 'haccord',
  [VehicleType.HATCHBACK]: 'ffocus18',
  [VehicleType.VAN]: 'ftransit18',
  [VehicleType.MINIVAN]: 'tsienna20',
  [VehicleType.PICKUP]: 'ff150',
};

const ORIENTATION_MAP = {
  [CarOrientation.FRONT_LEFT]: 'frontLeft',
  [CarOrientation.REAR_LEFT]: 'rearLeft',
  [CarOrientation.REAR_RIGHT]: 'rearRight',
  [CarOrientation.FRONT_RIGHT]: 'frontRight',
};

export default function useCarView360Wireframe({ orientation, vehicleType }) {
  const vehicleKey = useMemo(() => VEHICLE_MODEL_MAP[vehicleType], [vehicleType]);
  const orientationKey = useMemo(() => ORIENTATION_MAP[orientation], [orientation]);

  return useMemo(
    () => PartSelectorOverlays[vehicleKey][orientationKey],
    [vehicleKey, orientationKey],
  );
}
