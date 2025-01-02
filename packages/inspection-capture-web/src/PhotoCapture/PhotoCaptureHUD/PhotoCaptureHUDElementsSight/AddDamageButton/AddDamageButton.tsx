import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { AddDamage } from '@monkvision/types';
import { useColorBackground } from '../../../../hooks';

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
  addDamage?: AddDamage;
}

/**
 * Custom button displayed in the PhotoCapture Camera HUD that allows user to enter add damage mode.
 */
export function AddDamageButton({ onAddDamage, addDamage }: AddDamageButtonProps) {
  const { t } = useTranslation();
  const primaryColor = useColorBackground();

  return (
    <>
      {addDamage && addDamage !== AddDamage.DISABLED && (
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
