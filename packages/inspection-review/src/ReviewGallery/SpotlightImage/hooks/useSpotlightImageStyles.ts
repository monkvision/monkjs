import { useMonkTheme } from '@monkvision/common';
import { styles } from '../SpotlightImage.styles';

export interface SpotlightImageStylesProps {
  cursorStyle: string;
}

/**
 * Hook to get the styles for the SpotlightImage component.
 */
export function useSpotlightImageStyles({ cursorStyle }: SpotlightImageStylesProps) {
  const { palette } = useMonkTheme();

  return {
    containerStyle: {
      ...styles['container'],
      cursor: cursorStyle,
    },
    overlayContainerStyle: {
      ...styles['overlayContainer'],
    },
    closeButtonStyle: {
      ...styles['closeButton'],
    },
    hasDamagesButtonStyle: {
      ...styles['showDamagesButton'],
    },
    imageNavigationContainerStyle: {
      ...styles['imageNavigationContainer'],
    },
    imageContainerStyle: {
      ...styles['imageContainer'],
    },

    iconButtonStyle: {
      ...styles['iconButton'],
      primaryColor: palette.secondary.xdark,
      secondaryColor: palette.text.white,
    },
    showDamageButtonStyle: {
      primaryColor: palette.secondary.xdark,
      secondaryColor: palette.text.white,
    },
    imageLabelStyle: {
      ...styles['imageLabel'],
      backgroundColor: palette.background.light,
      color: palette.text.white,
    },
    shortcutsContainerStyle: {
      ...styles['shortcutsContainer'],
    },
  };
}
