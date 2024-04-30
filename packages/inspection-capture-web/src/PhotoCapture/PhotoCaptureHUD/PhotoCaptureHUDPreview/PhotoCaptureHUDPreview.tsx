import { Image, PixelDimensions, Sight } from '@monkvision/types';
import { PhotoCaptureMode } from '../../hooks';
import { PhotoCaptureHUDPreviewSight } from '../PhotoCaptureHUDPreviewSight';
import { PhotoCaptureHUDPreviewAddDamage1stShot } from '../PhotoCaptureHUDPreviewAddDamage1stShot';
import { PhotoCaptureHUDPreviewAddDamage2ndShot } from '../PhotoCaptureHUDPreviewAddDamage2ndShot';

/**
 * Props of the PhotoCaptureHUDPreview component.
 */
export interface PhotoCaptureHUDPreviewProps {
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
   * The dimensions of the Camera video stream.
   */
  streamDimensions: PixelDimensions | null;
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
export function PhotoCaptureHUDPreview(params: PhotoCaptureHUDPreviewProps) {
  if (params.isLoading || !!params.error) {
    return null;
  }
  if (params.mode === PhotoCaptureMode.SIGHT) {
    return (
      <PhotoCaptureHUDPreviewSight
        sights={params.sights}
        selectedSight={params.selectedSight}
        onSelectedSight={params.onSelectSight}
        sightsTaken={params.sightsTaken}
        onAddDamage={params.onAddDamage}
        streamDimensions={params.streamDimensions}
        images={params.images}
      />
    );
  }
  if (params.mode === PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT) {
    return <PhotoCaptureHUDPreviewAddDamage1stShot onCancel={params.onCancelAddDamage} />;
  }
  return (
    <PhotoCaptureHUDPreviewAddDamage2ndShot
      onCancel={params.onCancelAddDamage}
      streamDimensions={params.streamDimensions}
    />
  );
}
