import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles } from './AddDamageButton.styles';
import { HUDMode } from '../../hook';

export interface AddDamageButtonProps {
  onAddDamage: (newMode: HUDMode) => void;
}

export function AddDamageButton({ onAddDamage }: AddDamageButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      icon='add'
      onClick={() => onAddDamage(HUDMode.ADD_DAMAGE)}
      primaryColor='secondary-xdark'
      data-testid='monk-test-btn'
      style={styles['addDamageButton']}
    >
      {t('damage')}
    </Button>
  );
}
