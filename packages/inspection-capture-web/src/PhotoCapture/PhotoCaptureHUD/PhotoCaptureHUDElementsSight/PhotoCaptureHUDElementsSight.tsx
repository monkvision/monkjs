import { SightOverlay } from '@monkvision/common-ui-web';
import { SightSlider } from './SightSlider';
import { styles } from './PhotoCaptureHUDElementsSight.styles';
import { AddDamageButton } from './AddDamageButton';
import { PhotoCaptureHUDElementsSightProps, usePhotoCaptureHUDSightPreviewStyle } from './hooks';
import { PhotoCaptureHUDCounter } from '../PhotoCaptureHUDCounter';
import { PhotoCaptureMode } from '../../hooks';

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
  const style = usePhotoCaptureHUDSightPreviewStyle({ streamDimensions });

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
