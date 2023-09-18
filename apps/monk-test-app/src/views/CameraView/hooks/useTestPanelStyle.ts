import { useMonkTheme } from '@monkvision/common';
import { useMemo } from 'react';

export function useTestPanelStyle() {
  const { palette } = useMonkTheme();
  return useMemo(
    () => ({
      panel: {
        backgroundColor: palette.surface.s1,
        borderColor: palette.primary.xlight,
        color: palette.primary.xlight,
      },
      col: {
        color: palette.text.white,
      },
      colNoValue: {
        color: palette.text.disable,
        fontStyle: 'italic',
      },
    }),
    [palette],
  );
}
