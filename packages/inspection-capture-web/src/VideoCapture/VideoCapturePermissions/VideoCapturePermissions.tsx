import { useTranslation } from 'react-i18next';
import { useIsMounted, useLoadingState } from '@monkvision/common';
import { useCameraPermission } from '@monkvision/camera-web';
import { useMonitoring } from '@monkvision/monitoring';
import { PageLayoutItem, VideoCapturePageLayout } from '../VideoCapturePageLayout';

/**
 * Props accepted by the VideoCapturePermissions component.
 */
export interface VideoCapturePermissionsProps {
  /**
   * Callback used to request the compass permission on the device.
   */
  requestCompassPermission?: () => Promise<void>;
  /**
   * Callback called when the user has successfully granted the required permissions to the app.
   */
  onSuccess?: () => void;
}

/**
 * Component displayed in the Permissions view of the video capture. Used to make sure the current app has the proper
 * permissions before moving forward.
 */
export function VideoCapturePermissions({
  requestCompassPermission,
  onSuccess,
}: VideoCapturePermissionsProps) {
  const { t } = useTranslation();
  const loading = useLoadingState();
  const { handleError } = useMonitoring();
  const { requestCameraPermission } = useCameraPermission();
  const isMounted = useIsMounted();

  const handleConfirm = async () => {
    loading.start();
    try {
      if (requestCompassPermission) {
        await requestCompassPermission();
      }
      await requestCameraPermission();
      onSuccess?.();
      if (isMounted()) {
        loading.onSuccess();
      }
    } catch (err) {
      loading.onError(err);
      handleError(err);
    }
  };

  const confirmButtonProps = {
    onClick: handleConfirm,
    loading,
    children: t('video.permissions.confirm'),
  };

  return (
    <VideoCapturePageLayout confirmButtonProps={confirmButtonProps}>
      <PageLayoutItem
        icon='camera-outline'
        title={t('video.permissions.camera.title')}
        description={t('video.permissions.camera.description')}
      />
      <PageLayoutItem
        icon='compass-outline'
        title={t('video.permissions.compass.title')}
        description={t('video.permissions.compass.description')}
      />
    </VideoCapturePageLayout>
  );
}
