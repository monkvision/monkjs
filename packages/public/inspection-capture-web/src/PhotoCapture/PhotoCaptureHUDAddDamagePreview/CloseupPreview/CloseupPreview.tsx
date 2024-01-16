import { PixelDimensions, Sight } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { useSightLabel } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { styles } from './CloseupPreview.styles';
import { CancelButton } from '../CancelButton';
import { DamageCounter } from '../DamageCounter';
import { useCloseupPreviewStyle } from './hook';
import { AddDamagePreviewMode } from '../../hooks';

export interface CloseupPreviewProps {
  sight?: Sight | undefined;
  onCancel: () => void;
  streamDimensions?: PixelDimensions | null;
}

export function CloseupPreview({ sight, onCancel, streamDimensions }: CloseupPreviewProps) {
  const { t } = useTranslation();
  const { label } = useSightLabel({ labels });
  const style = useCloseupPreviewStyle();

  const sightLabel = sight && label(sight);
  const aspectRatio = streamDimensions
    ? `${streamDimensions?.width}/${streamDimensions?.height}`
    : '16/9';

  return (
    <div style={styles['container']}>
      <div style={{ ...styles['frameContainer'], aspectRatio }} data-testid='frame-container'>
        <div style={styles['frame']} />
      </div>
      <div style={styles['top']}>
        <DamageCounter addDamagePreviewMode={AddDamagePreviewMode.CLOSEUP_PREVIEW} />
        <CancelButton onCancel={onCancel} />
      </div>
      <div style={style.label} data-testid='sight-label'>
        {sightLabel}
      </div>
      <div style={styles['infoCloseup']}>{t('photo.hud.addDamage.infoCloseup')}</div>
    </div>
  );
}
