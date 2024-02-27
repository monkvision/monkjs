import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { usePhotoCaptureHUDButtonBackground } from '../../hooks';

/**
 * Props of the AddDamageButton component.
 */
export interface AddDamageButtonProps {
  /**
   * Callback called when the user presses the button.
   */
  onAddDamage?: () => void;
}

/**
 * Custom button displayed in the PhotoCapture Camera HUD that allows user to enter add damage mode.
 */
export function AddDamageButton({ onAddDamage }: AddDamageButtonProps) {
  const { t } = useTranslation();
  const backgroundColor = usePhotoCaptureHUDButtonBackground();

  return (
    <Button
      icon='add'
      onClick={onAddDamage}
      data-testid='monk-test-btn'
      style={{ backgroundColor }}
    >
      {t('photo.hud.sight.addDamageBtn')}
    </Button>
  );
}
