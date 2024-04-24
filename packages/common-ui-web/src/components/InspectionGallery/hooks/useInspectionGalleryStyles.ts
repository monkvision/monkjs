import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from '../InspectionGallery.styles';

export function useInspectionGalleryStyles() {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  return {
    containerStyle: {
      ...styles['container'],
      ...responsive(styles['containerSmallScreen']),
      backgroundColor: palette.background.base,
    },
    itemListStyle: styles['itemList'],
    itemStyle: styles['item'],
    fillerItemStyle: styles['fillerItem'],
    emptyStyle: {
      ...styles['empty'],
      color: palette.text.primary,
    },
  };
}
