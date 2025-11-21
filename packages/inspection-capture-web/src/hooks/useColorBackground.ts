import { useMonkTheme, changeAlpha } from '@monkvision/common';
import { useMemo } from 'react';

/**
 * Custom hook used to generate the background color in the inspection capture web components.
 */
export function useColorBackground(opacity = 0.64) {
  const { palette } = useMonkTheme();

  const clampedOpacity = Math.max(0, Math.min(opacity, 1));

  return useMemo(
    () => changeAlpha(palette.background.base, clampedOpacity),
    [palette, clampedOpacity],
  );
}
