import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { useColorBackground } from '../../hooks';

/**
 * Props of the CancelButton component.
 */
export interface CancelButtonProps {
  /**
   * Callback called when the user clicks on the button.
   */
  onCancel?: () => void;
}

/**
 * Component implementing a cancel button displayed in the Camera HUD.
 */
export function CancelButton({ onCancel }: CancelButtonProps) {
  const { t } = useTranslation();
  const primaryColor = useColorBackground();

  return (
    <Button onClick={onCancel} primaryColor={primaryColor}>
      {t('photo.hud.addDamage.cancelBtn')}
    </Button>
  );
}
