import { PhotoCaptureMode } from '../../hooks';
import { PhotoCaptureHUDElementsSight } from '../PhotoCaptureHUDElementsSight';
import { PhotoCaptureHUDElementsAddDamage1stShot } from '../PhotoCaptureHUDElementsAddDamage1stShot';
import { PhotoCaptureHUDElementsAddDamage2ndShot } from '../PhotoCaptureHUDElementsAddDamage2ndShot';
import { PhotoCaptureHUDElementsAddPartSelectShot } from '../PhotoCaptureHUDElementsAddPartSelectShot';
import { PhotoCaptureHUDElementsProps } from './PhotoCaptureHUDElements.model';

/**
 * Component implementing an HUD displayed on top of the Camera preview during the PhotoCapture process.
 */
export function PhotoCaptureHUDElements(params: PhotoCaptureHUDElementsProps) {
  if (params.isLoading || !!params.error) {
    return null;
  }
  if (params.mode === PhotoCaptureMode.SIGHT) {
    return (
      <PhotoCaptureHUDElementsSight
        sights={params.sights}
        selectedSight={params.selectedSight}
        onSelectedSight={params.onSelectSight}
        onRetakeSight={params.onRetakeSight}
        sightsTaken={params.sightsTaken}
        onAddDamage={params.onAddDamage}
        previewDimensions={params.previewDimensions}
        images={params.images}
        addDamage={params.addDamage}
        sightGuidelines={params.sightGuidelines}
        enableSightGuidelines={params.enableSightGuidelines}
        tutorialStep={params.tutorialStep}
      />
    );
  }
  if (params.mode === PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT) {
    return <PhotoCaptureHUDElementsAddDamage1stShot onCancel={params.onCancelAddDamage} />;
  }
  if (params.mode === PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT) {
    return <PhotoCaptureHUDElementsAddDamage2ndShot onCancel={params.onCancelAddDamage} />;
  }
  if (params.mode === PhotoCaptureMode.ADD_DAMAGE_PART_SELECT) {
    return (
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={params.onCancelAddDamage}
        onAddDamageParts={params.onAddDamageParts}
        partSelectState={params.addDamagePartSelectState}
      />
    );
  }
  return null as never;
}
