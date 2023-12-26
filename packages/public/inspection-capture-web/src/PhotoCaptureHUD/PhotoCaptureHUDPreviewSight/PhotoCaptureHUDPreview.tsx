import { Sight } from '@monkvision/types';
import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { PhotoCaptureHUDSightSlider } from './PhotoCaptureHUDSightSlider';
import { PhotoCaptureHUDSightCounter } from './PhotoCaptureHUDSightCounter';
import { PhotoCaptureHUDSightOverlay } from './PhotoCaptureHUDSightOverlay';
import { HUDMode } from '../hook';
import { styles } from './PhotoCaptureHUDPreview.styles';

export interface PhotoCaptureHUDPreviewProps {
  sights: Sight[];
  currentSight: Sight;
  onSightSelected?: (sight: Sight, index: number) => void;
  onAddDamage?: (newMode: HUDMode) => void;
  sightsTaken: Sight[];
  currentSightSliderIndex: number;
}

export function PhotoCaptureHUDPreview({
  sights,
  currentSight,
  onSightSelected = () => {},
  onAddDamage = () => {},
  sightsTaken,
  currentSightSliderIndex,
}: PhotoCaptureHUDPreviewProps) {
  const { t } = useTranslation();
  return (
    <div style={styles['container']}>
      <PhotoCaptureHUDSightOverlay sight={currentSight} />
      <div style={styles['top']}>
        <PhotoCaptureHUDSightCounter totalSights={sights.length} sightsTaken={sightsTaken.length} />
        <Button
          icon='add'
          onClick={() => onAddDamage(HUDMode.ADD_DAMAGE)}
          primaryColor='secondary-xdark'
          data-testid='monk-test-btn'
          style={styles['addDamageButton']}
        >
          {t('damage')}
        </Button>
      </div>
      <PhotoCaptureHUDSightSlider
        sights={sights}
        currentSight={currentSight?.id}
        sightsTaken={sightsTaken}
        onSightSelected={onSightSelected}
        currentSightSliderIndex={currentSightSliderIndex}
      />
    </div>
  );
}
