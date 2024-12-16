import { Styles } from '@monkvision/types';
import { DynamicSVGProps } from '@monkvision/common-ui-web';
import { CSSProperties, useCallback } from 'react';
import { fullyColorSVG, useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { VideoCaptureIntroLayoutProps } from './VideoCaptureIntroLayout.types';
import { INTRO_LAYOUT_MAX_HEIGHT_BREAKPOINT } from './IntroLayoutItem/IntroLayoutItem.styles';

export const styles: Styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logo: {
    margin: '32px 0',
    width: 80,
    height: 'auto',
  },
  logoSmall: {
    __media: {
      maxHeight: INTRO_LAYOUT_MAX_HEIGHT_BREAKPOINT,
    },
    display: 'none',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center',
    padding: '0 32px 16px 32px',
  },
  titleSmall: {
    __media: {
      maxHeight: INTRO_LAYOUT_MAX_HEIGHT_BREAKPOINT,
    },
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    padding: '10px 16px 10px 16px',
  },
  childrenContainer: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
  confirmContainer: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 32px 32px 32px',
  },
  confirmButton: {
    alignSelf: 'stretch',
    maxWidth: 400,
  },
};

interface VideoCaptureIntroLayoutStyles {
  logoProps: Partial<DynamicSVGProps>;
  containerStyle: CSSProperties;
  titleStyle: CSSProperties;
}

export function useVideoCaptureIntroLayoutStyles({
  showBackdrop,
}: Pick<VideoCaptureIntroLayoutProps, 'showBackdrop'>): VideoCaptureIntroLayoutStyles {
  const { palette } = useMonkTheme();
  const { responsive } = useResponsiveStyle();

  const getLogoAttributes = useCallback(
    (element: Element) => fullyColorSVG(element, palette.text.primary),
    [palette],
  );

  return {
    logoProps: {
      getAttributes: getLogoAttributes,
      style: {
        ...styles['logo'],
        ...responsive(styles['logoSmall']),
      },
    },
    containerStyle: {
      ...styles['container'],
      ...(showBackdrop ? styles['containerBackdrop'] : {}),
    },
    titleStyle: {
      ...styles['title'],
      ...responsive(styles['titleSmall']),
    },
  };
}
