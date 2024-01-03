import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { getHexFromRGBA, getRGBAFromString, useMonkTheme } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDAddDamagePreview.styles';

export interface PhotoCaptureHUDAddDamageMenuProps {
  onCancel: () => void;
}

export function PhotoCaptureHUDAddDamagePreview({ onCancel }: PhotoCaptureHUDAddDamageMenuProps) {
  const { t } = useTranslation();
  const { palette } = useMonkTheme();

  const bgColor = getHexFromRGBA({ ...getRGBAFromString(palette.secondary.xdark), a: 0.64 });

  return (
    <div style={styles['top']}>
      <Button onClick={onCancel} style={{ backgroundColor: bgColor }}>
        {t('photo.hud.addDamage.cancelBtn')}
      </Button>
    </div>
  );
}
