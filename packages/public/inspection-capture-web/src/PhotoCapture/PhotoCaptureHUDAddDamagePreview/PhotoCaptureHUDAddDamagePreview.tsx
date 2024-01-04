import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles } from './PhotoCaptureHUDAddDamagePreview.styles';
import { usePhotoHUDButtonBackground } from '../hooks';

export interface PhotoCaptureHUDAddDamageMenuProps {
  onCancel: () => void;
}

export function PhotoCaptureHUDAddDamagePreview({ onCancel }: PhotoCaptureHUDAddDamageMenuProps) {
  const { t } = useTranslation();
  const { bgColor } = usePhotoHUDButtonBackground();

  return (
    <div style={styles['top']}>
      <Button onClick={onCancel} style={{ backgroundColor: bgColor }}>
        {t('photo.hud.addDamage.cancelBtn')}
      </Button>
    </div>
  );
}
