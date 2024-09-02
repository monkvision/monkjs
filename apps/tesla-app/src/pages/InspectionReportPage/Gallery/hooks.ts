import { changeAlpha, useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from './Gallery.styles';
import { useMemo } from 'react';

export function useInspectionGalleryStyles() {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  const colors = useMemo(
    () => ({
      previewBackground: changeAlpha(palette.surface.dark, 0.56),
      previewOverlayBackgroundNetwork: changeAlpha(palette.caution.dark, 0.5),
      previewOverlayBackgroundCompliance: changeAlpha(palette.alert.base, 0.5),
      labelBackground: changeAlpha(palette.surface.dark, 0.32),
    }),
    [palette],
  );

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
    cardStyle: {
      ...styles['card'],
      // cursor: [InteractiveStatus.HOVERED, InteractiveStatus.ACTIVE].includes(status)
      //   ? 'pointer'
      //   : 'default',
    },
    // previewStyle: {
    //   ...styles['preview'],
    //   backgroundColor: colors.previewBackground,
    //   backgroundImage: `url(${item.image.thumbnailPath})`,
    // },
  };
}
