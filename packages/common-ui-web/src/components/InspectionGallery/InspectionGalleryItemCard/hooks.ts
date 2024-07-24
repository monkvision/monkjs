import { useMemo } from 'react';
import { changeAlpha, useMonkTheme, useObjectTranslation, useSightLabel } from '@monkvision/common';
import { labels, sights } from '@monkvision/sights';
import { ImageStatus, InteractiveStatus } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { styles } from './InspectionGalleryItemCard.styles';
import { InspectionGalleryItem } from '../types';
import { IconName } from '../../../icons';

export interface InspectionGalleryItemCardProps {
  item: InspectionGalleryItem;
  captureMode: boolean;
  onClick?: () => void;
}

export function useInspectionGalleryItemLabel(item: InspectionGalleryItem): string {
  const { t } = useTranslation();
  const { tObj } = useObjectTranslation();
  const { label } = useSightLabel({ labels });

  if (item.isAddDamage) {
    return t('card.addDamage');
  }
  if (!item.isTaken) {
    return label(sights[item.sightId]);
  }
  return item.image.label ? tObj(item.image.label) : '';
}

export function useInspectionGalleryItemStatusIconName({
  item,
  captureMode,
}: Pick<InspectionGalleryItemCardProps, 'item' | 'captureMode'>): IconName | null {
  if (!captureMode || item.isAddDamage || !item.isTaken) {
    return null;
  }
  switch (item.image.status) {
    case ImageStatus.UPLOADING:
      return 'processing';
    case ImageStatus.COMPLIANCE_RUNNING:
      return 'processing';
    case ImageStatus.SUCCESS:
      return 'check-circle';
    case ImageStatus.UPLOAD_FAILED:
      return 'wifi-off';
    case ImageStatus.UPLOAD_ERROR:
      return 'sync-problem';
    case ImageStatus.NOT_COMPLIANT:
      return 'error';
    default:
      return null;
  }
}

export interface UseInspectionGalleryItemCardStylesParams {
  item: InspectionGalleryItem;
  status: InteractiveStatus;
  captureMode: boolean;
}

export function useInspectionGalleryItemCardStyles({
  item,
  status,
  captureMode,
}: UseInspectionGalleryItemCardStylesParams) {
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

  let labelColor = palette.text.primary;
  if (status === InteractiveStatus.HOVERED) {
    labelColor = palette.primary.base;
  }
  if (status === InteractiveStatus.ACTIVE) {
    labelColor = palette.primary.dark;
  }

  let previewOverlayBackground = 'transparent';
  if (captureMode && !item.isAddDamage && item.isTaken) {
    if ([ImageStatus.UPLOAD_FAILED, ImageStatus.UPLOAD_ERROR].includes(item.image.status)) {
      previewOverlayBackground = colors.previewOverlayBackgroundNetwork;
    }
    if (item.image.status === ImageStatus.NOT_COMPLIANT) {
      previewOverlayBackground = colors.previewOverlayBackgroundCompliance;
    }
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
      backgroundImage:
        !item.isAddDamage && item.isTaken ? `url(${item.image.thumbnailPath})` : 'none',
    },
    previewOverlayStyle: {
      ...styles['previewOverlay'],
      backgroundColor: previewOverlayBackground,
    },
    labelStyle: {
      ...styles['label'],
      backgroundColor: colors.labelBackground,
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
