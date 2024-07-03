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
  /**
   * Boolean indicating whether the Add Damage feature is enabled. If disabled, the `Add Damage` button will be hidden.
   *
   * @default true
   */
  enableAddDamage?: boolean;
}

/**
 * Custom button displayed in the PhotoCapture Camera HUD that allows user to enter add damage mode.
 */
export function AddDamageButton({ onAddDamage, enableAddDamage }: AddDamageButtonProps) {
  const { t } = useTranslation();
  const primaryColor = usePhotoCaptureHUDButtonBackground();

  return (
    <>
      {enableAddDamage && (
        <Button
          icon='add'
          onClick={onAddDamage}
          data-testid='monk-test-btn'
          primaryColor={primaryColor}
        >
          {t('photo.hud.sight.addDamageBtn')}
        </Button>
      )}
    </>
  );
}
