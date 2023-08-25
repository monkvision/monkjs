import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nWrap } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { i18nCamera } from '../i18n';
import { CameraHUDProps, UserMediaErrorType } from '../Camera';
import './SimpleCameraHUD.css';

/**
 * The basic Camera HUD provided by the Monk camera package. It displays a button to take pictures, as well as error
 * messages (and a retry button) in case of errors with the Camera stream.
 */
export const SimpleCameraHUD = i18nWrap(({ handle, onPictureTaken }: CameraHUDProps) => {
  const { t } = useTranslation();
  const isHUDDisabled = useMemo(() => handle?.isLoading || !!handle?.error, [handle]);
  const withDisableSuffix = useCallback(
    (className: string) => `${className}${isHUDDisabled ? ' disabled' : ''}`,
    [isHUDDisabled],
  );
  const takePicture = useCallback(() => {
    if (handle?.takePicture) {
      const picture = handle.takePicture();
      if (onPictureTaken) {
        onPictureTaken(picture);
      }
    }
  }, [handle, onPictureTaken]);
  const errorTranslationKey = useMemo(() => {
    switch (handle?.error?.type) {
      case UserMediaErrorType.NOT_ALLOWED:
        return 'errors.permission';
      case UserMediaErrorType.STREAM_INACTIVE:
        return 'errors.inactive';
      case UserMediaErrorType.INVALID_STREAM:
        return 'errors.invalid';
      case UserMediaErrorType.OTHER:
        return 'errors.other';
      default:
        return '';
    }
  }, [handle]);

  return (
    <div className='simple-camera-hud-container'>
      {!handle?.isLoading && !!handle?.error && (
        <div className='message-container'>
          <div className='error-message'>{t(errorTranslationKey)}</div>
          <Button variant='outline' icon='sync-problem' onClick={handle?.retry}>
            {t('retry')}
          </Button>
        </div>
      )}
      <div className={withDisableSuffix('take-picture-btn')}>
        <button onClick={takePicture} disabled={isHUDDisabled}></button>
      </div>
    </div>
  );
}, i18nCamera);
