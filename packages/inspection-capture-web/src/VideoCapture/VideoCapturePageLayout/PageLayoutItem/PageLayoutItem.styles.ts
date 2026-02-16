import { CSSProperties } from 'react';
import { Styles } from '@monkvision/types';
import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { IconProps } from '@monkvision/common-ui-web';

export const PAGE_LAYOUT_MAX_HEIGHT_BREAKPOINT = 600;

export const styles: Styles = {
  container: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 16,
    gap: 8,
  },
  icon: {},
  labels: {
    flex: 1,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
  },
  titleSmall: {
    __media: {
      maxHeight: PAGE_LAYOUT_MAX_HEIGHT_BREAKPOINT,
    },
    fontSize: 14,
    fontWeight: 500,
  },
  description: {
    fontSize: 16,
    opacity: 0.91,
    fontWeight: 300,
    textAlign: 'center',
  },
  descriptionSmall: {
    __media: {
      maxHeight: PAGE_LAYOUT_MAX_HEIGHT_BREAKPOINT,
    },
    fontSize: 12,
    fontWeight: 400,
  },
};

interface PageLayoutItemStyle {
  iconProps: Partial<IconProps>;
  titleStyle: CSSProperties;
  descriptionStyle: CSSProperties;
}

export function usePageLayoutItemStyles(): PageLayoutItemStyle {
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
