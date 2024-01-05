import { useMonkTheme, changeAlpha } from '@monkvision/common';
import { useMemo } from 'react';

export function usePhotoHUDButtonBackground() {
  const { palette } = useMonkTheme();

  const bgColor = useMemo(() => changeAlpha(palette.secondary.xdark, 0.64), [palette]);

  return { bgColor };
}
