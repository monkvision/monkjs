import { useCallback, useMemo } from 'react';
import { isMobileDevice, useObjectMemo } from '@monkvision/common';
import { CameraResolution } from '@monkvision/types';
import { CameraFacingMode } from '../Camera';
import { getMediaConstraints } from '../Camera/hooks/utils';
import { useUserMedia } from '../Camera/hooks';

/**
 * Handle used to request camera permission on the user device.
 */
export interface CameraPermissionHandle {
  /**
   * Callback that can be used to request the camera permission on the current device.
   */
  requestCameraPermission: () => Promise<void>;
}

/**
 * Custom hook that can be used to request the camera permissions on the current device.
 */
export function useCameraPermission(): CameraPermissionHandle {
  const contraints = useMemo(
    () =>
      getMediaConstraints({
        resolution: isMobileDevice() ? CameraResolution.UHD_4K : CameraResolution.FHD_1080P,
        facingMode: CameraFacingMode.ENVIRONMENT,
      }),
    [],
  );
  const { getUserMedia } = useUserMedia(contraints, null);

  const requestCameraPermission = useCallback(async () => {
    const stream = await getUserMedia();
    stream.getTracks().forEach((track) => track.stop());
  }, [getUserMedia]);

  return useObjectMemo({ requestCameraPermission });
}
