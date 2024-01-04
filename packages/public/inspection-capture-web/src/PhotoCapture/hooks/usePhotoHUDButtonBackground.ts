import { getHexFromRGBA, getRGBAFromString, useMonkTheme } from '@monkvision/common';
import { useMemo } from 'react';

export function usePhotoHUDButtonBackground() {
  const { palette } = useMonkTheme();
  // removed this function after SwitchButton PR#656 is merged. Just import the function from common package afterward
  function changeAlpha(color: string, amount: number): string {
    const { a: _, ...rgb } = getRGBAFromString(color);
    return getHexFromRGBA({ a: amount, ...rgb });
  }

  const bgColor = useMemo(() => changeAlpha(palette.secondary.xdark, 0.64), [palette]);

  return { bgColor };
}
