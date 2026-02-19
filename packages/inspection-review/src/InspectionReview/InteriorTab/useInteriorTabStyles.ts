import { useMonkTheme } from '@monkvision/common';

/**
 * Hook to get styles for the InteriorTab component.
 */
export function useInteriorTabStyles() {
  const { palette } = useMonkTheme();

  return {
    editIcon: {
      cursor: 'pointer',
      width: 30,
      color: palette.text.white,
    },
    deleteIcon: {
      cursor: 'pointer',
      width: 30,
      color: palette.alert.base,
    },
  };
}
