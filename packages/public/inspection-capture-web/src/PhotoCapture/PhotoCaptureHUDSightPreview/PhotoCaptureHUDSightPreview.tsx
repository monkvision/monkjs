import { PixelDimensions, Sight } from '@monkvision/types';
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
  streamDimensions?: PixelDimensions | null;
}

export function PhotoCaptureHUDSightPreview({
  sights,
  selectedSight,
  onSelectedSight = () => {},
  onAddDamage = () => {},
  sightsTaken,
  streamDimensions,
}: PhotoCaptureHUDPreviewProps) {
  const style = usePhotoCaptureHUDSightPreviewStyle();
  const aspectRatio = `${streamDimensions?.width}/${streamDimensions?.height}`;

  return (
    <div style={styles['container']}>
      {streamDimensions && (
        <SightOverlay style={{ ...style.overlay, aspectRatio }} sight={selectedSight} />
      )}
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
