import { CaptureAppConfig, Image, PixelDimensions, Sight } from '@monkvision/types';
import { useResponsiveStyle } from '@monkvision/common';
import { CSSProperties } from 'react';
import { styles } from './PhotoCaptureHUDElementsSight.styles';

/**
 * Props of the PhotoCaptureHUDElementsSight component.
 */
export interface PhotoCaptureHUDElementsSightProps
  extends Pick<CaptureAppConfig, 'enableSightGuidelines' | 'sightGuidelines' | 'enableAddDamage'> {
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
   * The effective pixel dimensions of the Camera video stream on the screen.
   */
  previewDimensions?: PixelDimensions | null;
  /**
   * The current images taken by the user (ignoring retaken pictures etc.).
   */
  images: Image[];
}

export function usePhotoCaptureHUDSightPreviewStyle({
  previewDimensions,
}: Pick<PhotoCaptureHUDElementsSightProps, 'previewDimensions'>) {
  const { responsive } = useResponsiveStyle();

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
      width: previewDimensions?.width,
      height: previewDimensions?.height,
    },
    guidelineBtn: styles['guidelineBtn'],
    addDamageBtn: styles['addDamageBtn'],
  };
}

export function getVisilityStyle(enable?: boolean): CSSProperties {
  return { visibility: enable ? 'visible' : 'hidden' };
}
