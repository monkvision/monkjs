import { useWindowDimensions } from '@monkvision/common';
import { DeviceOrientation } from '@monkvision/types';

/**
 * Custom hook used to check if the current device's orientation is violating the enforced orientation. Returns true if
 * an orientation is being enforced and is not matching the current device orientation.
 */
export function useEnforceOrientation(orientation?: DeviceOrientation | null): boolean {
  const dimensions = useWindowDimensions();
  return !!orientation && (orientation === DeviceOrientation.PORTRAIT) !== dimensions.isPortrait;
}
