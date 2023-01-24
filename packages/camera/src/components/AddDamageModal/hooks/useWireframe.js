import { PartSelectorOverlays } from '@monkvision/sights/dist/partSelectors';
import { useMemo } from 'react';
import { CarOrientation } from './useCarOrientation';

const VEHICLE_MODEL_MAP = {
  suv: 'jgc21',
  cuv: 'fesc20',
  sedan: 'haccord',
  hatchback: 'ffocus18',
  van: 'ftransit18',
  minivan: 'tsienna20',
  pickup: 'ff150',
};

const ORIENTATION_MAP = {
  [CarOrientation.FRONT_LEFT]: 'frontLeft',
  [CarOrientation.REAR_LEFT]: 'rearLeft',
  [CarOrientation.REAR_RIGHT]: 'rearRight',
  [CarOrientation.FRONT_RIGHT]: 'frontRight',
};

export default function useWireframe({ orientation, vehicleType }) {
  const vehicleKey = useMemo(() => VEHICLE_MODEL_MAP[vehicleType], [vehicleType]);
  const orientationKey = useMemo(() => ORIENTATION_MAP[orientation], [orientation]);

  return useMemo(
    () => PartSelectorOverlays[vehicleKey][orientationKey],
    [vehicleKey, orientationKey],
  );
}
