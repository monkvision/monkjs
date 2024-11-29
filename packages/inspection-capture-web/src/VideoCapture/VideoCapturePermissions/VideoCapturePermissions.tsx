import { Button, DynamicSVG, Icon } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { useLoadingState } from '@monkvision/common';
import { useCameraPermission } from '@monkvision/camera-web';
import { useMonitoring } from '@monkvision/monitoring';
import { styles, useVideoCapturePermissionsStyles } from './VideoCapturePermissions.styles';
import { monkLogoSVG } from '../../assets/logos.asset';

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
  const {
    logoProps,
    permissionIconProps,
    titleStyle,
    permissionTitleStyle,
    permissionDescriptionStyle,
  } = useVideoCapturePermissionsStyles();

  const handleConfirm = async () => {
    loading.start();
    try {
      await requestCameraPermission();
      if (requestCompassPermission) {
        await requestCompassPermission();
      }
      onSuccess?.();
      loading.onSuccess();
    } catch (err) {
      loading.onError(err);
      handleError(err);
    }
  };

  return (
    <div style={styles['container']}>
      <DynamicSVG svg={monkLogoSVG} {...logoProps} />
      <div style={titleStyle}>{t('video.permissions.title')}</div>
      <div style={styles['permissionsContainer']}>
        <div style={styles['permission']}>
          <Icon icon='camera-outline' style={styles['permissionIcon']} {...permissionIconProps} />
          <div style={styles['permissionLabels']}>
            <div style={permissionTitleStyle}>{t('video.permissions.camera.title')}</div>
            <div style={permissionDescriptionStyle}>
              {t('video.permissions.camera.description')}
            </div>
          </div>
        </div>
        <div style={styles['permission']}>
          <Icon icon='compass-outline' style={styles['permissionIcon']} {...permissionIconProps} />
          <div style={styles['permissionLabels']}>
            <div style={permissionTitleStyle}>{t('video.permissions.compass.title')}</div>
            <div style={permissionDescriptionStyle}>
              {t('video.permissions.compass.description')}
            </div>
          </div>
        </div>
      </div>
      <div style={styles['confirmContainer']}>
        <Button onClick={handleConfirm} loading={loading}>
          {t('video.permissions.confirm')}
        </Button>
      </div>
    </div>
  );
}
