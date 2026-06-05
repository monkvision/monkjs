import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { ImageStatus, InteractiveStatus } from '@monkvision/types';
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

  let previewOverlayBackground = 'transparent';
  if ([ImageStatus.UPLOAD_FAILED, ImageStatus.UPLOAD_ERROR].includes(item.image.status)) {
    previewOverlayBackground = colors.previewOverlayBackgroundNetwork;
  }
  if (item.image.status === ImageStatus.NOT_COMPLIANT) {
    previewOverlayBackground = colors.previewOverlayBackgroundCompliance;
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
    previewOverlayStyle: {
      ...styles['previewOverlay'],
      backgroundColor: previewOverlayBackground,
    },
    labelStyle: {
      ...styles['label'],
      backgroundColor: isDamaged ? palette.alert.dark : colors.labelBackground,
      color: labelColor,
    },
    statusIcon: {
      style: styles['statusIcon'],
      size: 20,
      primaryColor: palette.text.primary,
    },
    sightOverlay: {
      height: styles['preview'].height,
    },
    addDamageIcon: {
      size: 40,
      primaryColor: labelColor,
    },
  };
}
