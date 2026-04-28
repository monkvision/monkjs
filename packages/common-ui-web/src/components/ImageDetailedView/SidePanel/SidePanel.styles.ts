import { CSSProperties } from 'react';
import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';

import { Styles } from '@monkvision/types';

export const SMALL_WIDTH_BREAKPOINT = 700;

export const styles: Styles = {
  thumbnailList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    height: '100%',
    justifyContent: 'center',
  },
  thumbnailListSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    flexDirection: 'row',
    width: '100%',
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '100%',
    height: 60,
  },
  thumbnail: {
    width: '100%',
    height: 60,
    objectFit: 'cover',
    borderRadius: 8,
    cursor: 'pointer',
    boxSizing: 'border-box',
    opacity: 0.9,
    border: '2px solid',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    lineHeight: 1,
  },
};

/**
 * Hook that computes all styles for the SidePanel and its sub-components.
 */
export function useSidePanelStyles() {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  return {
    thumbnailListStyle: {
      ...styles['thumbnailList'],
      ...responsive(styles['thumbnailListSmall']),
    },
    thumbnailWrapperStyle: styles['thumbnailWrapper'],
    selectedBadgeStyle: {
      ...styles['selectedBadge'],
      color: palette.success.base,
    },
    getThumbnailStyle: (isSelected: boolean): CSSProperties => ({
      ...styles['thumbnail'],
      borderColor: isSelected ? palette.text.white : 'transparent',
    }),
  };
}
