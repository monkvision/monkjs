import { useMonkTheme } from '@monkvision/common';
import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 6,
    width: '100%',
    height: '100%',
  },
  overlayContainer: { position: 'relative' },
  actionsContainer: {
    zIndex: 10,
    position: 'absolute',
    top: 10,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
    width: '-webkit-fill-available',
  },
  closeButton: {
    cursor: 'pointer',
  },
  showDamagesButton: {
    cursor: 'pointer',
  },
  navigationContainer: {
    zIndex: 10,
    position: 'absolute',
    bottom: 10,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    border: 'solid 2px',
  },
  imageLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    fontSize: 16,
    borderRadius: 9999,
  },
  imageLabelIcon: {
    marginRight: 8,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  shortcutsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
};

/**
 * Props for the useSpotlightImageStyles hook.
 */
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
      color: palette.text.primary,
    },
  };
}
