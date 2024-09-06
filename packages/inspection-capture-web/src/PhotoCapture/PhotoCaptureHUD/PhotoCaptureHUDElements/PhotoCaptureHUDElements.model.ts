import { CaptureAppConfig, Image, PixelDimensions, Sight } from '@monkvision/types';
import { AddDamageHandle, PhotoCaptureMode, TutorialSteps } from '../../hooks';

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
   * Callback to be called when the user clicks on the "Add Damage" button.
   */
  onAddDamage: AddDamageHandle['handleAddDamage'];
  /**
   * Callback to be called when the user selects the parts to take a picture of.
   */
  onAddDamageParts: AddDamageHandle['handleAddParts'];
  /**
   * Callback to be called when the user clicks on the "Cancel" button of the Add Damage mode.
   */
  onCancelAddDamage: AddDamageHandle['handleCancelAddDamage'];
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
