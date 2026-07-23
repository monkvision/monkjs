import { CameraRatio, PhotoCaptureAppConfig, Image, PixelDimensions, Sight } from '@monkvision/types';
import { useResponsiveStyle } from '@monkvision/common';
import { CSSProperties, useMemo } from 'react';
import { styles } from './PhotoCaptureHUDElementsSight.styles';
import { TutorialSteps } from '../../hooks';

/**
 * Props of the PhotoCaptureHUDElementsSight component.
 */
export interface PhotoCaptureHUDElementsSightProps
  extends Pick<PhotoCaptureAppConfig, 'sightGuidelines' | 'addDamage' | 'enableSightTutorial'> {
  /**
   * The list of sights provided to the PhotoCapture component.
   */
  sights: Sight[];
  /**
   * The currently selected sight in the PhotoCapture component : the sight that the user needs to capture.
   */
  selectedSight: Sight;
  /**
   * The current tutorial step in PhotoCapture component.
   */
  tutorialStep: TutorialSteps | null;
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
   * Callback called when the user clicks on both: 'disable' checkbox and 'okay' button.
   */
  onDisableSightGuidelines?: () => void;
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
  /**
   * Boolean indicating whether the sight guidelines should be displayed.
   */
  showSightGuidelines?: boolean;
  /**
   * Callback called when the user clicks on the "help" button in PhotoCapture.
   */
  toggleSightTutorial?: () => void;
  /**
   * The active crop ratio, or null/undefined if no ratio is configured.
   * When set, the sight overlay and HUD elements are constrained to the cropped area,
   * and a dimming overlay with a crop frame border is rendered around it.
   */
  cropRatio?: CameraRatio | null;
}

/**
 * Given the full preview dimensions on screen and a desired crop ratio, computes the dimensions of the
 * largest centred rectangle with that ratio that fits within the preview.
 */
function computeScreenCropDimensions(
  previewDimensions: PixelDimensions,
  cropRatio: CameraRatio,
): PixelDimensions {
  const targetRatio = cropRatio.width / cropRatio.height;
  const screenRatio = previewDimensions.width / previewDimensions.height;
  if (screenRatio > targetRatio) {
    const height = previewDimensions.height;
    return { width: Math.round(height * targetRatio), height };
  }
  const width = previewDimensions.width;
  return { width, height: Math.round(width / targetRatio) };
}

export function usePhotoCaptureHUDSightPreviewStyle({
  previewDimensions,
  cropRatio,
}: Pick<PhotoCaptureHUDElementsSightProps, 'previewDimensions' | 'cropRatio'>) {
  const { responsive } = useResponsiveStyle();

  const cropDimensions = useMemo(() => {
    if (!cropRatio || !previewDimensions) return previewDimensions ?? null;
    return computeScreenCropDimensions(previewDimensions, cropRatio);
  }, [cropRatio, previewDimensions]);

  return {
    container: styles['container'],
    elementsContainer: {
      ...styles['elementsContainer'],
      ...responsive(styles['elementsContainerPortrait']),
    },
    top: styles['top'],
    bottom: styles['bottom'],
    overlay: {
      width: cropDimensions?.width,
      height: cropDimensions?.height,
    },
    cropFrame:
      cropRatio && cropDimensions
        ? { width: cropDimensions.width, height: cropDimensions.height }
        : null,
    guidelineBtn: styles['guidelineBtn'],
    addDamageBtn: styles['addDamageBtn'],
  };
}

export function getVisilityStyle(enable?: boolean): CSSProperties {
  return { visibility: enable ? 'visible' : 'hidden' };
}
