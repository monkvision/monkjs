import { Sight } from '@monkvision/types';
import { Button } from '@monkvision/common-ui-web';
import { PhotoCaptureHUDPreview, usePhotoCaptureHUDPreview } from './hook';
import { PhotoCaptureHUDSightsSlider } from './PhotoCaptureHUDSightsSlider';
import { PhotoCaptureHUDCounter } from './PhotoCaptureHUDSightsCounter';

export interface PhotoCaptureHUDPreviewProps {
  sights?: Sight[];
  currentSight?: Sight;
  onSightSelected?: (sight: Sight) => void;
  onAddDamage?: () => void;
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
        <Button icon='add' onClick={onAddDamage}>
          Damage
        </Button>
      </div>
      <PhotoCaptureHUDSightsSlider
        sights={sights}
        currentSight={currentSight}
        onSightSelected={onSightSelected}
      />
    </div>
  );
}
