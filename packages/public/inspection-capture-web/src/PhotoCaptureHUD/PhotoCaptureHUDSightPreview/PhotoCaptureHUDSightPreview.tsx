import { Sight } from '@monkvision/types';
import { SightOverlay } from '@monkvision/common-ui-web';
import { SightsSlider } from './SightsSlider';
import { SightsCounter } from './SightsCounter';
import { HUDMode } from '../hook';
import { styles } from './PhotoCaptureHUDSightPreview.styles';
import { AddDamageButton } from './AddDamageButton';

export interface PhotoCaptureHUDPreviewProps {
  sights: Sight[];
  sightSelected: Sight;
  onSightSelected?: (sight: Sight) => void;
  onAddDamage?: (newMode: HUDMode) => void;
  sightsTaken: Sight[];
}

export function PhotoCaptureHUDSightPreview({
  sights,
  sightSelected,
  onSightSelected = () => {},
  onAddDamage = () => {},
  sightsTaken,
}: PhotoCaptureHUDPreviewProps) {
  return (
    <div style={styles['container']}>
      <SightOverlay style={styles['overlay']} sight={sightSelected} />;
      <div style={styles['top']}>
        <SightsCounter totalSights={sights.length} sightsTaken={sightsTaken.length} />
        <AddDamageButton onAddDamage={onAddDamage} />
      </div>
      <SightsSlider
        sights={sights}
        sightSelected={sightSelected}
        sightsTaken={sightsTaken}
        onSightSelected={onSightSelected}
      />
    </div>
  );
}
