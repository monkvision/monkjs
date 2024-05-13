import { Image, PixelDimensions, Sight } from '@monkvision/types';
import { SightOverlay } from '@monkvision/common-ui-web';
import { SightSlider } from './SightSlider';
import { styles } from './PhotoCaptureHUDElementsSight.styles';
import { AddDamageButton } from './AddDamageButton';
import { usePhotoCaptureHUDSightPreviewStyle } from './hooks';
import { PhotoCaptureHUDCounter } from '../PhotoCaptureHUDCounter';
import { PhotoCaptureMode } from '../../hooks';

/**
 * Props of the PhotoCaptureHUDElementsSight component.
 */
export interface PhotoCaptureHUDElementsSightProps {
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
   * Callback called when the user manually select a sight to retake.
   */
  onRetakeSight?: (sight: string) => void;
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
  /**
   * The current images taken by the user (ignoring retaken pictures etc.).
   */
  images: Image[];
  /**
   * Boolean indicating whether the Add Damage feature is disabled. If disabled, the `Add Damage` button will be hidden.
   *
   * @default true
   */
  enableAddDamage?: boolean;
}

/**
 * Component implementing an HUD displayed on top of the Camera preview during the PhotoCapture process when the current
 * mode is SIGHT.
 */
export function PhotoCaptureHUDElementsSight({
  sights,
  selectedSight,
  onSelectedSight = () => {},
  onRetakeSight = () => {},
  onAddDamage = () => {},
  sightsTaken,
  streamDimensions,
  images,
  enableAddDamage,
}: PhotoCaptureHUDElementsSightProps) {
  const style = usePhotoCaptureHUDSightPreviewStyle(streamDimensions);

  return (
    <div style={styles['container']}>
      {streamDimensions && <SightOverlay style={style.overlay} sight={selectedSight} />}
      <div style={style.elementsContainer}>
        <div style={style.top}>
          <AddDamageButton onAddDamage={onAddDamage} enableAddDamage={enableAddDamage} />
        </div>
        <div style={style.bottom}>
          <PhotoCaptureHUDCounter
            mode={PhotoCaptureMode.SIGHT}
            totalSights={sights.length}
            sightsTaken={sightsTaken.length}
          />
          <SightSlider
            sights={sights}
            selectedSight={selectedSight}
            sightsTaken={sightsTaken}
            onSelectedSight={onSelectedSight}
            onRetakeSight={onRetakeSight}
            images={images}
          />
        </div>
      </div>
    </div>
  );
}
