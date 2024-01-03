import { Sight } from '@monkvision/types';
import { SightOverlay } from '@monkvision/common-ui-web';
import { SightsSlider } from './SightsSlider';
import { SightsCounter } from './SightsCounter';
import { HUDMode } from '../hook';
import { styles } from './PhotoCaptureHUDSightPreview.styles';
import { AddDamageButton } from './AddDamageButton';
import { usePhotoCaptureHUDSightPreviewStyle } from './hook';

export interface PhotoCaptureHUDPreviewProps {
  sights: Sight[];
  selectedSight: Sight;
  onSelectedSight?: (sight: Sight) => void;
  onAddDamage?: (newMode: HUDMode) => void;
  sightsTaken: Sight[];
}

export function PhotoCaptureHUDSightPreview({
  sights,
  selectedSight,
  onSelectedSight = () => {},
  onAddDamage = () => {},
  sightsTaken,
}: PhotoCaptureHUDPreviewProps) {
  const style = usePhotoCaptureHUDSightPreviewStyle();
  return (
    <div style={styles['container']}>
      <SightOverlay style={style.overlay} sight={selectedSight} />
      <div style={styles['top']}>
        <SightsCounter totalSights={sights.length} sightsTaken={sightsTaken.length} />
        <AddDamageButton onAddDamage={onAddDamage} />
      </div>
      <SightsSlider
        sights={sights}
        selectedSight={selectedSight}
        sightsTaken={sightsTaken}
        onSelectedSight={onSelectedSight}
      />
    </div>
  );
}
