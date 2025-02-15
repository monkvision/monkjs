import { SightOverlay } from '@monkvision/common-ui-web';
import { SightSlider } from './SightSlider';
import { styles } from './PhotoCaptureHUDElementsSight.styles';
import { AddDamageButton } from './AddDamageButton';
import { PhotoCaptureHUDElementsSightProps, usePhotoCaptureHUDSightPreviewStyle } from './hooks';
import { TutorialSteps } from '../../hooks';
import { SightGuideline } from './SightGuideline';
import { Counter } from '../../../components';
import { CaptureMode } from '../../../types';

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
  previewDimensions,
  images,
  addDamage,
  sightGuidelines,
  enableSightGuidelines,
  tutorialStep,
}: PhotoCaptureHUDElementsSightProps) {
  const style = usePhotoCaptureHUDSightPreviewStyle({ previewDimensions });

  const showSight = previewDimensions && (!tutorialStep || tutorialStep === TutorialSteps.SIGHT);

  return (
    <div style={styles['container']}>
      {showSight && <SightOverlay style={style.overlay} sight={selectedSight} />}
      {!tutorialStep && (
        <div style={style.elementsContainer}>
          <div style={style.top}>
            <SightGuideline
              sightId={selectedSight.id}
              sightGuidelines={sightGuidelines}
              enableSightGuidelines={enableSightGuidelines}
              addDamage={addDamage}
            />
            <AddDamageButton onAddDamage={onAddDamage} addDamage={addDamage} />
          </div>
          <div style={style.bottom}>
            <Counter
              mode={CaptureMode.SIGHT}
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
      )}
    </div>
  );
}
