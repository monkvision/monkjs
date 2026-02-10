import { useMonkTheme } from '@monkvision/common';
import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderWidth: '1px',
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
  },

  thContent: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    letterSpacing: '0.1px',
    padding: '12px 16px',
  },

  tbody: {
    position: 'relative',
    width: '100%',
  },
  tr: {
    border: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px 16px',
  },
  tdContent: {
    display: 'flex',
    gap: '4px',
  },
  tdCurrencyLeft: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  actionIconsContainer: {
    display: 'flex',
    gap: '10px',
  },

  tfooter: {
    position: 'relative',
    width: '100%',
  },

  addDamageContainer: {
    position: 'relative',
    width: `calc(100% - 2px)`,
    padding: '14px 0px',
    borderWidth: '0 1px 1px 1px',
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

/**
 * Hook to get styles for the InteriorTab component.
 */
export function useInteriorTabStyles() {
  const { palette } = useMonkTheme();

  return {
    editIconStyle: {
      cursor: 'pointer',
      width: 30,
      color: palette.text.primary,
    },
    deleteIconStyle: {
      cursor: 'pointer',
      width: 30,
      color: palette.alert.base,
    },
    addDamageStyle: {
      color: palette.text.primary,
      backgroundColor: palette.background.base,
    },
  };
}
