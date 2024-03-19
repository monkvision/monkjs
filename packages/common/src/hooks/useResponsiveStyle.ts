import { CSSProperties, useCallback } from 'react';
import { CSSMediaQuery, ResponsiveStyleProperties } from '@monkvision/types';
import { useWindowDimensions, WindowDimensions } from './useWindowDimensions';

function areQueryConditionsMet(
  query: CSSMediaQuery | null | undefined,
  dimensions: WindowDimensions | null | undefined,
): boolean {
  if (!query || !dimensions) {
    return true;
  }
  if (query.maxWidth !== undefined && dimensions.width > query.maxWidth) {
    return false;
  }
  if (query.minWidth !== undefined && dimensions.width < query.minWidth) {
    return false;
  }
  if (query.maxHeight !== undefined && dimensions.height > query.maxHeight) {
    return false;
  }
  if (query.minHeight !== undefined && dimensions.height < query.minHeight) {
    return false;
  }
  if (query.portrait !== undefined && dimensions.isPortrait !== query.portrait) {
    return false;
  }
  if (query.landscape !== undefined && dimensions.isPortrait !== !query.landscape) {
    return false;
  }
  return true;
}

/**
 * Custom hook used to render the given style only when its media query confitions are met.
 *
 * @example
 * import { useResponsiveStyle } from '@monkvision/common';
 * import { Styles } from '@monkvision/types';
 *
 * const styles: Styles = {
 *   div: {
 *     width: 100,
 *     height: 100,
 *   },
 *   divMobile: {
 *     __media: { maxWidth: 500 },
 *     backgroundColor: '#ff0000',
 *   },
 * };
 *
 * function TestComponent() {
 *   const { responsive } = useResponsiveStyle();
 *   return <div style={{...styles.div, ...responsive(styles.divMobile)}}>Hello</div>
 * }
 */
export function useResponsiveStyle(): {
  responsive: (style: ResponsiveStyleProperties | null) => CSSProperties | null;
} {
  const dimensions = useWindowDimensions();
  const responsive = useCallback(
    (style: ResponsiveStyleProperties | null) => {
      if (areQueryConditionsMet(style?.__media, dimensions)) {
        return style;
      }
      return null;
    },
    [dimensions],
  );

  return { responsive };
}
