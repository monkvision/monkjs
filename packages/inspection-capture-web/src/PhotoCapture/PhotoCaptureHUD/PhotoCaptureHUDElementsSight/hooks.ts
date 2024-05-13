import { Image, PixelDimensions, Sight } from '@monkvision/types';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDElementsSight.styles';

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

export function usePhotoCaptureHUDSightPreviewStyle({
  streamDimensions,
}: Pick<PhotoCaptureHUDElementsSightProps, 'streamDimensions'>) {
  const { responsive } = useResponsiveStyle();
  const aspectRatio = `${streamDimensions?.width}/${streamDimensions?.height}`;

  return {
    container: styles['container'],
    elementsContainer: {
      ...styles['elementsContainer'],
      ...responsive(styles['elementsContainerPortrait']),
    },
    top: styles['top'],
    bottom: styles['bottom'],
    overlay: {
      ...styles['overlay'],
      aspectRatio,
    },
  };
}
