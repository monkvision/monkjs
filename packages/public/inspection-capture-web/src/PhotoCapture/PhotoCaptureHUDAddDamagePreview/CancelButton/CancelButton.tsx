import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { usePhotoHUDButtonBackground } from '../../hooks';

export interface CancelButtonProps {
  onCancel: () => void;
}

export function CancelButton({ onCancel }: CancelButtonProps) {
  const { t } = useTranslation();
  const { bgColor } = usePhotoHUDButtonBackground();

  return (
    <Button onClick={onCancel} style={{ backgroundColor: bgColor }}>
      {t('photo.hud.addDamage.cancelBtn')}
    </Button>
  );
}
