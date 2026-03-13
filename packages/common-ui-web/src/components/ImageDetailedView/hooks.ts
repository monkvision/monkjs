import { Image, Viewpoint } from '@monkvision/types';
import { changeAlpha, useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { styles } from './ImageDetailedView.styles';

/**
 * Props accepted by the ImageDetailedView component.
 */
export type ImageDetailedViewProps = {
  /**
   * The image to display the details of.
   */
  image: Image;
  /**
   * The viewpoint associated with this image when used in beauty shot selection.
   */
  view?: Viewpoint;
  /**
   * Optional additional images displayed as thumbnails that the user can select.
   */
  alternativeImages?: Image[];
  /**
   * Callback called when the user selects a different image from the thumbnails.
   */
  onImageSelected?: (image: Image) => void;
  /**
   * Callback called when the user validates the selection of an alternative image as the new beauty shot.
   */
  onValidateAlternative?: (image: Image, view: Viewpoint) => void;
  /**
   * The language to be used by the component.
   *
   * @default en
   */
  lang?: string | null;
  /**
   * Boolean indicating if the gallery button (used to go back to the gallery if this component is used inside the
   * gallery) must be displayed or not.
   *
   * @default true
   */
  showGalleryButton?: boolean;
  /**
   * Callback called when the user presses the close button.
   */
  onClose?: () => void;
  /**
   * Callback called when the user presses the gallery button if it is displayed.
   */
  onNavigateToGallery?: () => void;
} & (
  | {
      /**
       * Boolean indicating if this component is displayed in "capture" mode. Capture mode enables features such as
       * compliance, retakes, navigating to capture etc. Set this prop to `true` if your user is currently capturing
       * pictures for their inspection.
       *
       * @default false
       */
      captureMode: true;
      /**
       * Boolean indicating if the capture button must be displayed or not. This prop can only be specified if
       * `captureMode` is set to true.
       *
       * @default true
       */
      showCaptureButton?: boolean;
      /**
       * Callback called when the user presses the capture button. This prop can only be specified if `captureMode` is
       * set to true.
       */
      onNavigateToCapture?: () => void;
      /**
       * Callback called when the user presses the retake button. This prop can only be specified if `captureMode` is
       * set to true.
       */
      onRetake?: () => void;
    }
  | {
      /**
       * Boolean indicating if this component is displayed in "capture" mode. Capture mode enables features such as
       * compliance, retakes, navigating to capture etc. Set this prop to `true` if your user is currently capturing
       * pictures for their inspection.
       *
       * @default false
       */
      captureMode: false;
    }
);

export function useImageDetailedViewStyles(props: ImageDetailedViewProps) {
  const { palette } = useMonkTheme();
  const { responsive } = useResponsiveStyle();

  const colors = useMemo(
    () => ({
      darkButtonBackground: changeAlpha(palette.surface.dark, 0.56),
    }),
    [palette],
  );

  let rightContainerJustifyContent = 'space-between';
  if (props.captureMode && !props.showGalleryButton) {
    rightContainerJustifyContent = 'end';
  }

  return {
    mainContainerStyle: {
      ...styles['mainContainer'],
      ...responsive(styles['mainContainerSmall']),
      backgroundColor: palette.background.base,
      backgroundImage: `url(${props.image.path})`,
    },
    leftContainerStyle: styles['leftContainer'],
    overlayContainerStyle: styles['overlayContainer'],
    rightContainerStyle: {
      ...styles['rightContainer'],
      justifyContent: rightContainerJustifyContent,
      ...responsive(styles['rightContainerSmall']),
    },
    closeButton: {
      primaryColor: colors.darkButtonBackground,
      secondaryColor: palette.text.white,
    },
    galleryButton: {
      primaryColor: colors.darkButtonBackground,
      secondaryColor: palette.text.white,
      style: {
        visibility: props.showGalleryButton ?? true ? 'visible' : 'hidden',
      } as CSSProperties,
    },
    cameraButton: {
      style: {
        visibility: props.captureMode && (props.showCaptureButton ?? true) ? 'visible' : 'hidden',
      } as CSSProperties,
    },
  };
}

/**
 * Hook managing the image selection and validation state when alternative images are available.
 * Tracks two separate states:
 * - **selected**: The image the user is currently previewing (highlighted thumbnail border).
 * - **validated**: The image confirmed as the beauty shot (✓ badge). Only changes on validate.
 */
export function useImageSelector(
  image: Image,
  alternativeImages?: Image[],
  onImageSelected?: (image: Image) => void,
  onValidateAlternative?: (image: Image, view: Viewpoint) => void,
) {
  const images = [image, ...(alternativeImages?.slice(0, 3) ?? [])];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [validatedIndex, setValidatedIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hasValidatedOnce, setHasValidatedOnce] = useState(false);

  const selectedImage = images[selectedIndex] ?? images[0];
  const validatedImage = images[validatedIndex] ?? images[0];
  const hasChanged = selectedIndex !== validatedIndex;
  const hasAlternatives = (alternativeImages?.length ?? 0) > 0;

  const selectImage = (index: number) => {
    setSelectedIndex(index);
    onImageSelected?.(images[index]);
  };

  useEffect(() => {
    if (!showSuccessMessage) {
      return undefined;
    }
    const timer = setTimeout(() => setShowSuccessMessage(false), 1000);
    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  const handleValidate = useCallback(
    (img: Image, view: Viewpoint) => {
      setValidatedIndex(selectedIndex);
      setHasValidatedOnce(true);
      onValidateAlternative?.(img, view);
      setShowSuccessMessage(true);
    },
    [selectedIndex, onValidateAlternative],
  );

  return {
    selectedImage,
    validatedImage,
    hasChanged,
    hasAlternatives,
    hasValidatedOnce,
    selectImage,
    images,
    showThumbnails,
    setShowThumbnails,
    showSuccessMessage,
    handleValidate,
  };
}
