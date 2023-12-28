import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { styles } from './PhotoCaptureHUDAddDamagePreview.styles';
import { HUDMode } from '../hook';

export interface PhotoCaptureHUDAddDamageMenuProps {
  onAddDamage: (newMode: HUDMode) => void;
}

export function PhotoCaptureHUDAddDamagePreview({
  onAddDamage,
}: PhotoCaptureHUDAddDamageMenuProps) {
  const { t } = useTranslation();
  return (
    <div style={styles['top']}>
      <Button onClick={() => onAddDamage(HUDMode.DEFAULT)}> {t('cancel')} </Button>;
    </div>
  );
}
