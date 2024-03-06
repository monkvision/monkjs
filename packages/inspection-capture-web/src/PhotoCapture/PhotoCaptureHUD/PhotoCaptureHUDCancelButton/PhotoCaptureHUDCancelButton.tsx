import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { usePhotoCaptureHUDButtonBackground } from '../hooks';

/**
 * Props of the PhotoCaptureHUDCancelButton component.
 */
export interface PhotoCaptureHUDCancelButtonProps {
  /**
   * Callback called when the user clicks on the button.
   */
  onCancel?: () => void;
}

/**
 * Component implementing a cancel button displayed in the PhotoCapture Camera HUD.
 */
export function PhotoCaptureHUDCancelButton({ onCancel }: PhotoCaptureHUDCancelButtonProps) {
  const { t } = useTranslation();
  const backgroundColor = usePhotoCaptureHUDButtonBackground();

  return (
    <Button onClick={onCancel} style={{ backgroundColor }}>
      {t('photo.hud.addDamage.cancelBtn')}
    </Button>
  );
}
