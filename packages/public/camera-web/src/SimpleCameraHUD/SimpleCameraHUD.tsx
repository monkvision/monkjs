import { useTranslation } from 'react-i18next';
import { i18nWrap, useResponsiveStyle } from '@monkvision/common';
import { Button, TakePictureButton } from '@monkvision/common-ui-web';
import { i18nCamera } from '../i18n';
import { CameraHUDProps, UserMediaErrorType } from '../Camera';
import { styles } from './SimpleCameraHUD.styles';

function getErrorTranslationKey(error?: UserMediaErrorType): string {
  switch (error) {
    case UserMediaErrorType.NOT_ALLOWED:
      return 'errors.permission';
    case UserMediaErrorType.STREAM_INACTIVE:
      return 'errors.inactive';
    case UserMediaErrorType.INVALID_STREAM:
      return 'errors.invalid';
    case UserMediaErrorType.OTHER:
      return 'errors.other';
    default:
      return 'errors.other';
  }
}

/**
 * The basic Camera HUD provided by the Monk camera package. It displays a button to take pictures, as well as error
 * messages (and a retry button) in case of errors with the Camera stream.
 */
export const SimpleCameraHUD = i18nWrap(({ cameraPreview, handle }: CameraHUDProps) => {
  const { t } = useTranslation();
  const { responsive } = useResponsiveStyle();
  const isHUDDisabled = handle?.isLoading || !!handle?.error;

  return (
    <div style={{ ...styles['container'], ...responsive(styles['containerPortrait']) }}>
      <div style={styles['previewContainer']}>{cameraPreview}</div>
      {!handle?.isLoading && !!handle?.error && (
        <div style={styles['messageContainer']}>
          <div
            data-testid='error-message'
            style={{ ...styles['errorMessage'], ...responsive(styles['errorMessagePortrait']) }}
          >
            {t(getErrorTranslationKey(handle?.error?.type))}
          </div>
          {handle?.retry && (
            <Button
              style={styles['retryButton']}
              variant='outline'
              icon='refresh'
              onClick={handle.retry}
            >
              {t('retry')}
            </Button>
          )}
        </div>
      )}
      <TakePictureButton
        style={{ ...styles['takePictureButton'], ...responsive(styles['takePicturePortrait']) }}
        disabled={isHUDDisabled}
        onClick={handle?.takePicture}
        size={60}
      />
    </div>
  );
}, i18nCamera);
