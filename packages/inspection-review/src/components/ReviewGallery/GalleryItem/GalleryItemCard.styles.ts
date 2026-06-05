import { useMemo } from 'react';
import { InteractiveStatus, Styles } from '@monkvision/types';
import { changeAlpha, useMonkState, useMonkTheme } from '@monkvision/common';
import type { GalleryItem } from '../../../types';
import { useInspectionReviewProvider } from '../../../hooks';

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
  const { state } = useMonkState();
  const { palette } = useMonkTheme();
  const { selectedExteriorPart } = useInspectionReviewProvider();

  const colors = useMemo(
    () => ({
      previewBackground: changeAlpha(palette.surface.dark, 0.56),
      previewOverlayBackgroundNetwork: changeAlpha(palette.caution.dark, 0.5),
      previewOverlayBackgroundCompliance: changeAlpha(palette.alert.base, 0.5),
      labelBackground: changeAlpha(palette.secondary.dark, 0.52),
    }),
    [palette],
  );

  const labelColor = useMemo(() => {
    let color = palette.text.white;
    if (status === InteractiveStatus.HOVERED) {
      color = palette.primary.base;
    }
    if (status === InteractiveStatus.ACTIVE) {
      color = palette.primary.dark;
    }
    return color;
  }, [status, palette.text.white, palette.primary.base, palette.primary.dark]);

  const containsDamagesOfSelectedPart = useMemo(() => {
    const selectedPartDamageIds = item.parts.find(
      (p) => p.type === selectedExteriorPart?.part && p.damages.length > 0,
    )?.damages;

    if (!selectedPartDamageIds) {
      return false;
    }

    return state.views.find((view) => selectedPartDamageIds.includes(view.elementId));
  }, [item.parts, selectedExteriorPart, state.views]);

  const labelBackgroundColor = useMemo(() => {
    const isCloseUpGalleryItem = !item.sight;
    let color = colors.labelBackground;

    if (selectedExteriorPart) {
      if ((item.hasDamage && containsDamagesOfSelectedPart) || isCloseUpGalleryItem) {
        color = palette.alert.dark;
      }
    } else if (item.hasDamage || isCloseUpGalleryItem) {
      color = palette.alert.dark;
    }

    return color;
  }, [
    selectedExteriorPart,
    item.hasDamage,
    item.sight,
    item.parts,
    palette.alert.dark,
    colors.labelBackground,
  ]);

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
      backgroundColor: labelBackgroundColor,
      color: labelColor,
    },
  };
}
