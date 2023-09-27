import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { i18nWrap } from '@monkvision/common';
import { Button, TakePictureButton } from '@monkvision/common-ui-web';
import { i18nCamera } from '../i18n';
import { CameraHUDProps, UserMediaErrorType } from '../Camera';
import './SimpleCameraHUD.css';

/**
 * The basic Camera HUD provided by the Monk camera package. It displays a button to take pictures, as well as error
 * messages (and a retry button) in case of errors with the Camera stream.
 */
export const SimpleCameraHUD = i18nWrap(({ handle }: CameraHUDProps) => {
  const { t } = useTranslation();
  const isHUDDisabled = useMemo(() => handle?.isLoading || !!handle?.error, [handle]);
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
    <div className='mnk-simple-camera-hud-container'>
      {!handle?.isLoading && !!handle?.error && (
        <div className='mnk-message-container'>
          <div data-testid='error-message' className='mnk-error-message'>
            {t(errorTranslationKey)}
          </div>
          {handle?.retry && (
            <Button className='mnk-retry-btn' variant='outline' icon='refresh' onClick={handle.retry}>
              {t('retry')}
            </Button>
          )}
        </div>
      )}
      <TakePictureButton
        className='mnk-simple-camera-hud-take-picture-btn'
        disabled={isHUDDisabled}
        onClick={handle?.takePicture}
        size={60}
      />
    </div>
  );
}, i18nCamera);
