import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { getHexFromRGBA, useMonkTheme, getRGBAFromString } from '@monkvision/common';
import { HUDMode } from '../../hook';

export interface AddDamageButtonProps {
  onAddDamage: (newMode: HUDMode) => void;
}

export function AddDamageButton({ onAddDamage }: AddDamageButtonProps) {
  const { t } = useTranslation();
  const { palette } = useMonkTheme();

  const bgColor = getHexFromRGBA({ ...getRGBAFromString(palette.secondary.xdark), a: 0.64 });

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
