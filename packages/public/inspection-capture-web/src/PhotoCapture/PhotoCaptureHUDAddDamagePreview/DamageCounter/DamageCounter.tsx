import { useTranslation } from 'react-i18next';
import { styles } from './DamageCounter.styles';
import { AddDamagePreviewMode, usePhotoHUDButtonBackground } from '../../hooks';

export interface DamageCounterProps {
  addDamagePreviewMode: AddDamagePreviewMode;
}

export function DamageCounter({ addDamagePreviewMode }: DamageCounterProps) {
  const { t } = useTranslation();
  const { bgColor } = usePhotoHUDButtonBackground();

  const previewMode = Object.values(AddDamagePreviewMode).indexOf(addDamagePreviewMode) + 1;
  const totalDamage = Object.values(AddDamagePreviewMode).length;
  const counterText =
    addDamagePreviewMode === AddDamagePreviewMode.DEFAULT
      ? t('photo.hud.addDamage.damagedPart')
      : t('photo.hud.addDamage.closeupPicture');

  return (
    <div
      style={{ ...styles['counter'], backgroundColor: bgColor }}
      data-testid={'damage-counter'}
    >{`${previewMode} / ${totalDamage} • ${counterText}`}</div>
  );
}
