import {
  changeAlpha,
  useMonkTheme,
  useResponsiveStyle,
  useWindowDimensions,
} from '@monkvision/common';
import { Styles } from '@monkvision/types';

const PAGE_LAYOUT_MAX_HEIGHT_BREAKPOINT = 400;

export const styles: Styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '40px 18px',
    boxSizing: 'border-box',
    opacity: 1,
    transition: 'opacity 0.6s ease-in-out',
  },
  containerSmall: {
    __media: {
      maxHeight: PAGE_LAYOUT_MAX_HEIGHT_BREAKPOINT,
    },
    padding: '2px 10px',
  },
  containerFadeOut: {
    opacity: 0,
  },
  containerFadeIn: {
    opacity: 0,
  },
  containerLandscape: {
    flexDirection: 'row',
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    opacity: 1,
    transition: 'opacity 0.6s ease-in-out',
  },
  fadeOut: {
    opacity: 0,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 500,
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: 400,
    opacity: 0.8,
    margin: 0,
    lineHeight: 1.6,
    textAlign: 'center',
    minHeight: '52px',
  },
  progressWrapper: {
    width: '100%',
    marginTop: '24px',
  },
  progressTrack: {
    height: '3px',
    width: '100%',
    borderRadius: '999px',
    overflow: 'hidden',
    display: 'flex',
  },
  progressSegment: {
    height: '100%',
    flex: 1,
    transition: 'background-color 0.5s ease-in-out',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    alignItems: 'center',
  },
  bottomSectionLandscape: {
    width: '50%',
  },
  button: {
    width: '100%',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'all 0.5s ease-in-out',
  },
  buttonVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    opacity: 0.7,
    userSelect: 'none',
  },
  checkboxSpacer: { height: '0px' },
  vehicleSurroundingsSvg: {
    width: '100%',
    height: 'auto',
  },
  vehicleOrbitSvg: {
    width: '100%',
    height: 'auto',
  },
};

export interface VideoTutorialStylesParams {
  isTransitioning: boolean;
  showButton: boolean;
  isFadingOut: boolean;
  isFadingIn: boolean;
}

export function useVideoTutorialStyles({
  isTransitioning,
  showButton,
  isFadingOut,
  isFadingIn,
}: VideoTutorialStylesParams) {
  const dimensions = useWindowDimensions();
  const { palette, utils } = useMonkTheme();
  const { responsive } = useResponsiveStyle();
  const backgroundColor = changeAlpha(utils.getColor(palette.surface.light), 0.2);
  return {
    containerStyle: {
      ...styles['container'],
      ...(!dimensions.isPortrait && styles['containerLandscape']),
      ...(isFadingOut && styles['containerFadeOut']),
      ...(isFadingIn && styles['containerFadeIn']),
      ...responsive(styles['containerSmall']),
    },
    contentStyle: {
      ...styles['centerContent'],
      ...(isTransitioning && styles['fadeOut']),
    },
    bottomSectionStyle: {
      ...styles['bottomSection'],
      ...(!dimensions.isPortrait && styles['bottomSectionLandscape']),
    },
    buttonStyle: {
      ...styles['button'],
      ...(showButton && styles['buttonVisible']),
    },
    progressSegmentActiveStyle: {
      backgroundColor: palette.surface.light,
    },
    checkboxStyle: {
      ...styles['checkbox'],
      accentColor: palette.success.base,
    },
    progressTrackStyle: {
      ...styles['progressTrack'],
      backgroundColor,
    },
    progressSegmentStyle: {
      ...styles['progressSegment'],
      backgroundColor,
    },
  };
}
