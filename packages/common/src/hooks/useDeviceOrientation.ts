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
 * Options accepted by the useDeviceOrientation hook.
 */
export interface UseDeviceOrientationOptions {
  /**
   * Custom event handler that will be called every time a device orientation event is fired by the device.
   */
  onDeviceOrientationEvent?: (event: DeviceOrientationEvent) => void;
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
   * orientation of the device on the compass (AKA on the Z axis or "yaw", 0 = pointing North, 90 = pointing East etc.).
   * This value starts being updated once the permissions for the compass has been granted using the
   * `requestCompassPermission` method.
   */
  alpha: number;
  /**
   * A number representing the motion of the device around the X axis, expressed in degrees with values ranging from
   * -180 (inclusive) to 180 (exclusive). This represents a front to back motion of the device AKA the "pitch".
   */
  beta: number;
  /**
   * A number representing the motion of the device around the Y axis, express in degrees with values ranging from -90
   * (inclusive) to 90 (exclusive). This represents a left to right motion of the device AKA the "roll".
   */
  gamma: number;
}

/**
 * Custom hook used to get the device orientation data using the embedded compass on the device.
 */
export function useDeviceOrientation(
  options?: UseDeviceOrientationOptions,
): DeviceOrientationHandle {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  const handleDeviceOrientationEvent = useCallback(
    (event: DeviceOrientationEvent) => {
      const webkitHeading = (event as DeviceOrientationEventiOS).webkitCompassHeading;
      let heading: number;

      if (webkitHeading !== undefined) {
        heading = webkitHeading;
      } else if (event.alpha !== null) {
        heading = 360 - event.alpha;
      } else {
        heading = 0;
      }

      setAlpha(heading);
      setBeta(event.beta ?? 0);
      setGamma(event.gamma ?? 0);

      options?.onDeviceOrientationEvent?.({
        ...event,
        alpha: heading,
      });
    },
    [options?.onDeviceOrientationEvent],
  );

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
    if (!isPermissionGranted) {
      return undefined;
    }

    const eventType =
      'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';

    window.addEventListener(eventType, handleDeviceOrientationEvent);

    return () => {
      window.removeEventListener(eventType, handleDeviceOrientationEvent);
    };
  }, [isPermissionGranted, handleDeviceOrientationEvent]);

  return useObjectMemo({
    alpha,
    beta,
    gamma,
    isPermissionGranted,
    requestCompassPermission,
  });
}
