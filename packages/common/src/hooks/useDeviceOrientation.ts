import { useCallback, useEffect, useState } from 'react';
import { useObjectMemo } from './useObjectMemo';

enum DeviceOrientationPermissionResponse {
  GRANTED = 'granted',
  DENIED = 'denied',
}

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
  requestPermission?: () => Promise<DeviceOrientationPermissionResponse>;
}

/**
 * Handle used to mcontrol the device orientation.
 */
export interface DeviceOrientationHandle {
  /**
   * Boolean indicating if the permission for the device's compass data has been granted. It is equal to `false` by
   * default, and will be equal to true once the `requestCompassPermission` method has successfuly resolved.
   */
  isPermissionGranted: boolean;
  /**
   * Async function used to ask for the compass permission on the device.
   * - On iOS, a pop-up will appear asking for the user confirmation. This function will reject if something goes wrong
   * or if the user declines.
   * - On Android and other devices, this function will resolve directly and the process will be seemless for the user.
   */
  requestCompassPermission: () => Promise<void>;
  /**
   * The current `alpha` value of the device. This value is a number in degrees (between 0 and 360), and represents the
   * orientation of the device on the compass (0 = pointing North, 90 = pointing East etc.). This value starts being
   * updated once the permissions for the compass has been granted using the `requestCompassPermission` method.
   */
  alpha: number;
}

/**
 * Custom hook used to get the device orientation data using the embedded compass on the device.
 */
export function useDeviceOrientation(): DeviceOrientationHandle {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [alpha, setAlpha] = useState(0);

  const handleDeviceOrientationEvent = useCallback((event: DeviceOrientationEvent) => {
    const alpha = (event as DeviceOrientationEventiOS).webkitCompassHeading ?? event.alpha ?? 0;
    setAlpha(alpha);
  }, []);

  const requestCompassPermission = useCallback(async () => {
    if (DeviceOrientationEvent) {
      const { requestPermission } = DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;
      if (typeof requestPermission === 'function') {
        const response = await requestPermission();
        if (response !== DeviceOrientationPermissionResponse.GRANTED) {
          throw new Error('Device orientation permission request denied.');
        }
      }
    }
    setIsPermissionGranted(true);
  }, []);

  useEffect(() => {
    if (isPermissionGranted) {
      window.addEventListener('deviceorientation', handleDeviceOrientationEvent);
    }

    return () => {
      if (isPermissionGranted) {
        window.removeEventListener('deviceorientation', handleDeviceOrientationEvent);
      }
    };
  }, [isPermissionGranted, handleDeviceOrientationEvent]);

  return useObjectMemo({ isPermissionGranted, alpha, requestCompassPermission });
}
