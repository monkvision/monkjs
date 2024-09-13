import { useMonkTheme } from '@monkvision/common';
import { CSSProperties } from 'react';

export function usePhotoCaptureHUDElementsAddPartSelectShotStyle(): Record<
  'popup' | 'dialogButtonGroup' | 'vehicleSelect' | 'button',
  CSSProperties
> {
  const { palette } = useMonkTheme();
  const minValueWithAspectRatio = (width: number) => `min(${width}dvw, calc(${width}dvh * 1.5))`;
  return {
    popup: {
      width: `clamp(${minValueWithAspectRatio(80)}, 80%, ${minValueWithAspectRatio(90)})`,
      backgroundColor: palette.background.base,
      display: 'flex',
      flexDirection: 'column',
      justifyItems: 'center',
      padding: '3svw',
      gap: 10,
      borderRadius: '3svmin',
      alignItems: 'center',
      boxSizing: 'border-box',
      overflow: 'scroll',
      maxHeight: '100%',
    },
    dialogButtonGroup: { display: 'flex', gap: 20 },
    vehicleSelect: { alignSelf: 'stretch', justifySelf: 'stretch' },
    button: { padding: '.5svw 2svw', fontSize: 'min(14px, 3svmin)', borderRadius: '4svmin' },
  };
}
