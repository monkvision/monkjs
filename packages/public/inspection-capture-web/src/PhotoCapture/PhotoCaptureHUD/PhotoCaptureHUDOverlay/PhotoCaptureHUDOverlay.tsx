import { useTranslation } from 'react-i18next';
import { Button, Spinner } from '@monkvision/common-ui-web';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDOverlay.styles';
import { PhotoCaptureHUDOverlayProps, usePhotoCaptureErrorLabel, useRetry } from './hooks';

/**
 * Component that displays an overlay on top of the PhotoCapture component that is used to display elements such as
 * error messages, spinning loaders etc.
 */
export function PhotoCaptureHUDOverlay({
  isCaptureLoading,
  captureError,
  handle,
  onRetry,
  inspectionId,
}: PhotoCaptureHUDOverlayProps) {
  const { t } = useTranslation();
  const { responsive } = useResponsiveStyle();
  const error = usePhotoCaptureErrorLabel(captureError, handle, inspectionId);
  const handleRetry = useRetry({ captureError, handle, onRetry });

  if (!isCaptureLoading && !handle.isLoading && !error) {
    return null;
  }

  return (
    <div style={styles['overlay']} data-testid='overlay'>
      {!error && (isCaptureLoading || handle.isLoading) && (
        <Spinner size={80} primaryColor='primary' />
      )}
      {error && (
        <>
          <div
            style={{
              ...styles['errorMessage'],
              ...responsive(styles['errorMessageMobile']),
              ...responsive(styles['errorMessageTablet']),
            }}
          >
            {error}
          </div>
          {handleRetry && (
            <Button
              style={styles['retryButton']}
              variant='outline'
              icon='refresh'
              onClick={handleRetry}
            >
              {t('photo.hud.error.retry')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
