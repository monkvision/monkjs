import { CaptureAppConfig, Image, PixelDimensions, Sight } from '@monkvision/types';
import { PhotoCaptureMode, TutorialSteps } from '../../hooks';
import { PhotoCaptureHUDElementsSight } from '../PhotoCaptureHUDElementsSight';
import { PhotoCaptureHUDElementsAddDamage1stShot } from '../PhotoCaptureHUDElementsAddDamage1stShot';
import { PhotoCaptureHUDElementsAddDamage2ndShot } from '../PhotoCaptureHUDElementsAddDamage2ndShot';

/**
 * Props of the PhotoCaptureHUDElements component.
 */
export interface PhotoCaptureHUDElementsProps
  extends Pick<CaptureAppConfig, 'enableSightGuidelines' | 'sightGuidelines' | 'addDamage'> {
  /**
   * The currently selected sight in the PhotoCapture component : the sight that the user needs to capture.
   */
  selectedSight: Sight;
  /**
   * The list of sights provided to the PhotoCapture component.
   */
  sights: Sight[];
  /**
   * Array containing the list of sights that the user has already captured.
   */
  sightsTaken: Sight[];
  /**
   * The current mode of the component.
   */
  mode: PhotoCaptureMode;
  /**
   * The current tutorial step in PhotoCapture component.
   */
  tutorialStep: TutorialSteps | null;
  /**
   * Callback called when the user presses the Add Damage button.
   */
  onAddDamage: () => void;
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancelAddDamage: () => void;
  /**
   * Callback called when the user manually select a new sight.
   */
  onSelectSight: (sight: Sight) => void;
  /**
   * Callback called when the user manually selects a sight to retake.
   */
  onRetakeSight: (sight: string) => void;
  /**
   * The effective pixel dimensions of the Camera video stream on the screen.
   */
  previewDimensions: PixelDimensions | null;
  /**
   * Boolean indicating if the global loading state of the PhotoCapture component is loading or not.
   */
  isLoading?: boolean;
  /**
   * The error that occurred in the PhotoCapture component. Set this value to `null` if there is no error.
   */
  error?: unknown | null;
  /**
   * The current images taken by the user (ignoring retaken pictures etc.).
   */
  images: Image[];
}

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
  return (
    <PhotoCaptureHUDElementsAddDamage2ndShot
      onCancel={params.onCancelAddDamage}
      streamDimensions={params.previewDimensions}
    />
  );
}
