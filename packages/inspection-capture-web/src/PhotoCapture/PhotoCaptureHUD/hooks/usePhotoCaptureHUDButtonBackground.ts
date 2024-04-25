import { useMonkTheme, changeAlpha } from '@monkvision/common';
import { useMemo } from 'react';

/**
 * Custom hook used to generate the background color for the buttons in the PhotoCaptureHUD component.
 */
export function usePhotoCaptureHUDButtonBackground() {
  const { palette } = useMonkTheme();

  return useMemo(() => changeAlpha(palette.background.base, 0.64), [palette]);
}
