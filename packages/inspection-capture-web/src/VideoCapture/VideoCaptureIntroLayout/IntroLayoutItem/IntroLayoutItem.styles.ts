import { CSSProperties } from 'react';
import { Styles } from '@monkvision/types';
import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { IconProps } from '@monkvision/common-ui-web';

export const INTRO_LAYOUT_MAX_HEIGHT_BREAKPOINT = 600;

export const styles: Styles = {
  container: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  icon: {
    marginRight: 12,
  },
  labels: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
  },
  titleSmall: {
    __media: {
      maxHeight: INTRO_LAYOUT_MAX_HEIGHT_BREAKPOINT,
    },
    fontSize: 14,
    fontWeight: 500,
  },
  description: {
    fontSize: 18,
    paddingTop: 6,
    opacity: 0.91,
    fontWeight: 300,
  },
  descriptionSmall: {
    __media: {
      maxHeight: INTRO_LAYOUT_MAX_HEIGHT_BREAKPOINT,
    },
    fontSize: 12,
    fontWeight: 400,
  },
};

interface IntroLayoutItemStyle {
  iconProps: Partial<IconProps>;
  titleStyle: CSSProperties;
  descriptionStyle: CSSProperties;
}

export function useIntroLayoutItemStyles(): IntroLayoutItemStyle {
  const { palette } = useMonkTheme();
  const { responsive } = useResponsiveStyle();

  return {
    iconProps: {
      size: 40,
      primaryColor: palette.primary.base,
      style: {
        ...styles['icon'],
        ...responsive(styles['iconSmall']),
      },
    },
    titleStyle: {
      ...styles['title'],
      ...responsive(styles['titleSmall']),
    },
    descriptionStyle: {
      ...styles['description'],
      ...responsive(styles['descriptionSmall']),
    },
  };
}
