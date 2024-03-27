import { PixelDimensions, Sight } from '@monkvision/types';
import { SightOverlay } from '@monkvision/common-ui-web';
import { SightsSlider } from './SightsSlider';
import { styles } from './PhotoCaptureHUDPreviewSight.styles';
import { AddDamageButton } from './AddDamageButton';
import { usePhotoCaptureHUDSightPreviewStyle } from './hook';
import { PhotoCaptureHUDCounter } from '../PhotoCaptureHUDCounter';
import { PhotoCaptureMode } from '../../hooks';

/**
 * Props of the PhotoCaptureHUDPreviewSight component.
 */
export interface PhotoCaptureHUDSightPreviewProps {
  /**
   * The list of sights provided to the PhotoCapture component.
   */
  sights: Sight[];
  /**
   * The currently selected sight in the PhotoCapture component : the sight that the user needs to capture.
   */
  selectedSight: Sight;
  /**
   * Callback called when the user manually select a new sight.
   */
  onSelectedSight?: (sight: Sight) => void;
  /**
   * Callback called when the user clicks on the AddDamage button.
   */
  onAddDamage?: () => void;
  /**
   * Array containing the list of sights that the user has already captured.
   */
  sightsTaken: Sight[];
  /**
   * The dimensions of the Camera video stream.
   */
  streamDimensions?: PixelDimensions | null;
}

/**
 * Component implementing an HUD displayed on top of the Camera preview during the PhotoCapture process when the current
 * mode is SIGHT.
 */
export function PhotoCaptureHUDPreviewSight({
  sights,
  selectedSight,
  onSelectedSight = () => {},
  onAddDamage = () => {},
  sightsTaken,
  streamDimensions,
}: PhotoCaptureHUDSightPreviewProps) {
  const style = usePhotoCaptureHUDSightPreviewStyle();
  const aspectRatio = `${streamDimensions?.width}/${streamDimensions?.height}`;

  return (
    <div style={styles['container']}>
      {streamDimensions && (
        <SightOverlay style={{ ...style.overlay, aspectRatio }} sight={selectedSight} />
      )}
      <div style={style.top}>
        <PhotoCaptureHUDCounter
          mode={PhotoCaptureMode.SIGHT}
          totalSights={sights.length}
          sightsTaken={sightsTaken.length}
        />
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
