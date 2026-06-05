import { useMonkTheme } from '@monkvision/common';
import { styles } from './InteriorTab.styles';

/**
 * Hook to get styles for the InteriorTab component.
 */
export function useInteriorTabStyles() {
  const { palette } = useMonkTheme();

  return {
    containerStyle: {
      ...styles['container'],
    },
    tableStyle: {
      ...styles['table'],
    },
    thContentStyle: {
      ...styles['thContent'],
    },
    tbodyStyle: {
      ...styles['tbody'],
    },
    trStyle: {
      ...styles['tr'],
    },
    tdStyle: {
      ...styles['td'],
    },
    tdContentStyle: {
      ...styles['tdContent'],
    },
    tdCurrencyLeftStyle: {
      ...styles['tdCurrencyLeft'],
    },
    actionIconsContainerStyle: {
      ...styles['actionIcons'],
    },
    editIconStyle: {
      cursor: 'pointer',
      width: 30,
      color: palette.text.white,
    },
    deleteIconStyle: {
      cursor: 'pointer',
      width: 30,
      color: palette.alert.base,
    },
    addDamageContainerStyle: {
      ...styles['addDamageContainer'],
    },
  };
}
