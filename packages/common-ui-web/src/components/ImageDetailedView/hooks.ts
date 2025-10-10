import { Image } from '@monkvision/types';
import { changeAlpha, useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { CSSProperties, useMemo } from 'react';
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

  let rightContainerJustifyContent = 'start';
  if (props.captureMode) {
    rightContainerJustifyContent = props.showGalleryButton ? 'space-between' : 'end';
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
      ...responsive(styles['rightContainerSmall']),
      justifyContent: rightContainerJustifyContent,
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
