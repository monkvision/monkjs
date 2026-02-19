import { useMemo } from 'react';
import { InteractiveStatus, Styles } from '@monkvision/types';
import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { GalleryItem } from '../../types';

const CARD_WIDTH_PX = 140;
const CARD_BORDER_RADIUS_PX = 8;

export const styles: Styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: CARD_WIDTH_PX,
    height: 'fit-content',
    borderRadius: CARD_BORDER_RADIUS_PX,
    border: 'none',
    outline: 'none',
    padding: 0,
    backgroundColor: 'transparent',
  },
  preview: {
    position: 'relative',
    width: '100%',
    height: 82,
    boxSizing: 'border-box',
    borderTopLeftRadius: CARD_BORDER_RADIUS_PX,
    borderTopRightRadius: CARD_BORDER_RADIUS_PX,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
  label: {
    width: '100%',
    height: 46,
    fontSize: 14,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: CARD_BORDER_RADIUS_PX,
    borderBottomRightRadius: CARD_BORDER_RADIUS_PX,
    padding: '0 8px',
  },
};

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
}

/**
 * Hook to get styles for the GalleryItemCard component.
 */
export function useGalleryItemCardStyles({ item, status }: UseGalleryItemCardStylesParams) {
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
      backgroundColor: item.hasDamage || !item.sight ? palette.alert.dark : colors.labelBackground,
      color: labelColor,
    },
  };
}
