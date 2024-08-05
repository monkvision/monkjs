import { useTranslation } from 'react-i18next';
import {
  i18nWrap,
  useI18nSync,
  useObjectTranslation,
  useResponsiveStyle,
} from '@monkvision/common';
import { Button, TakePictureButton } from '@monkvision/common-ui-web';
import { i18nCamera } from '../i18n';
import { CameraHUDProps } from '../Camera';
import { styles } from './SimpleCameraHUD.styles';
import { getCameraErrorLabel } from '../utils';

/**
 * Props accepted by the SimpleCameraHUD component.
 */
export type SimpleCameraHUDProps = CameraHUDProps & {
  /**
   * This prop can be used to specify the language to be used by the SimpleCameraHUD component.
   *
   * @default: en
   */
  lang?: string | null;
};

/**
 * The basic Camera HUD provided by the Monk camera package. It displays a button to take pictures, as well as error
 * messages (and a retry button) in case of errors with the Camera stream.
 */
export const SimpleCameraHUD = i18nWrap(function SimpleCameraHUD({
  cameraPreview,
  handle,
  lang,
}: SimpleCameraHUDProps) {
  useI18nSync(lang);
  const { t } = useTranslation();
  const { tObj } = useObjectTranslation();
  const { responsive } = useResponsiveStyle();
  const isHUDDisabled = handle.isLoading || !!handle.error;
  const errorLabel = getCameraErrorLabel(handle.error?.type);

  return (
    <div style={{ ...styles['container'], ...responsive(styles['containerPortrait']) }}>
      <div style={styles['previewContainer']}>{cameraPreview}</div>
      {!handle.isLoading && !!handle.error && errorLabel && (
        <div style={styles['messageContainer']}>
          <div
            data-testid='error-message'
            style={{ ...styles['errorMessage'], ...responsive(styles['errorMessagePortrait']) }}
          >
            {tObj(errorLabel)}
          </div>
          <Button
            style={styles['retryButton']}
            variant='outline'
            icon='refresh'
            onClick={handle.retry}
          >
            {t('retry')}
          </Button>
        </div>
      )}
      <TakePictureButton
        style={{ ...styles['takePictureButton'], ...responsive(styles['takePicturePortrait']) }}
        disabled={isHUDDisabled}
        onClick={handle.takePicture}
        size={60}
      />
    </div>
  );
},
i18nCamera);
