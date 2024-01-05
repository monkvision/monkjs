import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { HUDMode } from '../../hook';
import { usePhotoHUDButtonBackground } from '../../hooks';

export interface AddDamageButtonProps {
  onAddDamage: (newMode: HUDMode) => void;
}

export function AddDamageButton({ onAddDamage }: AddDamageButtonProps) {
  const { t } = useTranslation();
  const { bgColor } = usePhotoHUDButtonBackground();

  return (
    <Button
      icon='add'
      onClick={() => onAddDamage(HUDMode.ADD_DAMAGE)}
      data-testid='monk-test-btn'
      style={{ backgroundColor: bgColor }}
    >
      {t('photo.hud.sight.addDamageBtn')}
    </Button>
  );
}
