import { useTranslation } from 'react-i18next';
import { Button, Spinner } from '@monkvision/common-ui-web';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './HUDOverlay.styles';
import { HUDOverlayProps, useErrorLabel, useRetry } from './hooks';

/**
 * Component that displays an overlay on top of the PhotoCapture/DamageDisclosure component that is used
 * to display elements such as error messages, spinning loaders etc.
 */
export function HUDOverlay({
  isCaptureLoading,
  captureError,
  handle,
  onRetry,
  inspectionId,
}: HUDOverlayProps) {
  const { t } = useTranslation();
  const { responsive } = useResponsiveStyle();
  const error = useErrorLabel(captureError, handle, inspectionId);
  const handleRetry = useRetry({ captureError, handle, onRetry });

  if (!isCaptureLoading && !error) {
    return null;
  }

  return (
    <div style={styles['overlay']} data-testid='overlay'>
      {!error && isCaptureLoading && <Spinner size={80} primaryColor='primary' />}
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
