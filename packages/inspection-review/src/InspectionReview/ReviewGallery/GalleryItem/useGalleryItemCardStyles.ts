import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { InteractiveStatus } from '@monkvision/types';
import { useMemo } from 'react';
import { GalleryItem } from '../../types';
import { styles } from './GalleryItemCard.styles';

/**
 * Parameters for the useGalleryItemCardStyles hook.
 */
export interface UseGalleryItemCardStylesParams {
  /**
   * The gallery item to style.
   */
  item: GalleryItem;
  /**
   * The interactive status of the gallery item (hovered, focused, etc.).
   */
  status: InteractiveStatus;
  /**
   * Indicates if the gallery item is damaged.
   */
  isDamaged: boolean;
}

/**
 * Hook to get styles for the GalleryItemCard component.
 */
export function useGalleryItemCardStyles({
  item,
  status,
  isDamaged,
}: UseGalleryItemCardStylesParams) {
  const { palette } = useMonkTheme();

  const colors = useMemo(
    () => ({
      previewBackground: changeAlpha(palette.surface.dark, 0.56),
      previewOverlayBackgroundNetwork: changeAlpha(palette.caution.dark, 0.5),
      previewOverlayBackgroundCompliance: changeAlpha(palette.alert.base, 0.5),
      labelBackground: changeAlpha(palette.secondary.dark, 0.52),
    }),
    [palette],
  );

  let labelColor = palette.text.white;
  if (status === InteractiveStatus.HOVERED) {
    labelColor = palette.primary.base;
  }
  if (status === InteractiveStatus.ACTIVE) {
    labelColor = palette.primary.dark;
  }

  return {
    cardStyle: {
      ...styles['card'],
      cursor: [InteractiveStatus.HOVERED, InteractiveStatus.ACTIVE].includes(status)
        ? 'pointer'
        : 'default',
    },
    previewStyle: {
      ...styles['preview'],
      backgroundColor: colors.previewBackground,
      backgroundImage: `url(${item.image.path})`,
    },
    labelStyle: {
      ...styles['label'],
      backgroundColor: isDamaged ? palette.alert.dark : colors.labelBackground,
      color: labelColor,
    },
  };
}
