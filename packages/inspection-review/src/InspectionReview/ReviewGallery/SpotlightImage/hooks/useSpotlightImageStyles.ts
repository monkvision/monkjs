import { useMonkTheme } from '@monkvision/common';
import { styles } from '../SpotlightImage.styles';

/**
 * Hook to get the styles for the SpotlightImage component.
 */
export function useSpotlightImageStyles() {
  const { palette } = useMonkTheme();

  return {
    iconButton: {
      primaryColor: palette.secondary.xdark,
      secondaryColor: palette.text.white,
    },
    showDamageButton: {
      primaryColor: palette.secondary.xdark,
      secondaryColor: palette.text.white,
    },
    imageLabelStyle: {
      ...styles['imageLabel'],
      backgroundColor: palette.background.light,
      color: palette.text.black,
    },
  };
}
