import { Sight } from '@monkvision/types';
import { Button } from '@monkvision/common-ui-web';
import { PhotoCaptureHUDPreview, usePhotoCaptureHUDPreview } from './hook';
import { PhotoCaptureHUDSightsSlider } from './components/PhotoCaptureHUDSightsSlider';
import { PhotoCaptureHUDCounter } from './components/PhotoCaptureHUDSightsCounter';
import { PhotoCaptureHUDSightsOverlay } from './components/PhotoCaptureHUDSightsOverlay';

export interface PhotoCaptureHUDPreviewProps {
  sights?: Sight[];
  currentSight?: Sight;
  onSightSelected?: (sight: Sight) => void;
  onAddDamage?: (state: boolean) => void;
  sightsTaken?: number;
}

export function PhotoCaptureHUDPreview({
  sights,
  currentSight,
  onSightSelected,
  onAddDamage,
  sightsTaken,
}: PhotoCaptureHUDPreviewProps) {
  const style = usePhotoCaptureHUDPreview();

  return (
    <div style={style.containerStyle}>
      <div style={style.top}>
        <PhotoCaptureHUDCounter totalSights={sights?.length} sightsTaken={sightsTaken} />
        <Button icon='add' onClick={() => onAddDamage?.(true)} data-testid='monk-test-btn'>
          Damage
        </Button>
      </div>
      <PhotoCaptureHUDSightsOverlay sight={currentSight} />
      <PhotoCaptureHUDSightsSlider
        sights={sights}
        currentSight={currentSight?.id}
        onSightSelected={onSightSelected}
      />
    </div>
  );
}
