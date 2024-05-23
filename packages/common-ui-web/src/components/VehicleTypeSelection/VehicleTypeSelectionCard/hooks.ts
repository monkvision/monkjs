import { InteractiveStatus } from '@monkvision/types';
import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { useMemo } from 'react';
import { styles } from './VehicleTypeSelectionCard.styles';

export interface VehicleTypeSelectionCardStyleParams {
  isSelected: boolean;
  status: InteractiveStatus;
}

interface CardInteractiveColor {
  default: string;
  hovered: string;
  active: string;
  selected: string;
}

function getCardColor(
  colors: CardInteractiveColor,
  isSelected: boolean,
  status: InteractiveStatus,
): string {
  if (isSelected) {
    return colors.selected;
  }
  if (status === InteractiveStatus.HOVERED) {
    return colors.hovered;
  }
  if (status === InteractiveStatus.ACTIVE) {
    return colors.active;
  }
  return colors.default;
}

export function useVehicleTypeSelectionCardStyles({
  isSelected,
  status,
}: VehicleTypeSelectionCardStyleParams) {
  const { palette } = useMonkTheme();

  const colors = useMemo(
    () => ({
      assetContainerBackground: {
        default: changeAlpha(palette.surface.dark, 0.56),
        hovered: changeAlpha(palette.surface.dark, 0.4),
        active: changeAlpha(palette.surface.dark, 0.24),
        selected: changeAlpha(palette.surface.light, 0.08),
      },
      labelBackground: {
        default: changeAlpha(palette.surface.dark, 0.32),
        hovered: changeAlpha(palette.surface.dark, 0.24),
        active: changeAlpha(palette.surface.dark, 0.18),
        selected: palette.surface.light,
      },
    }),
    [palette],
  );

  return {
    containerStyle: {
      ...styles['container'],
      ...(isSelected ? styles['containerSelected'] : {}),
      cursor: isSelected ? 'default' : 'pointer',
    },
    assetContainerStyle: {
      ...styles['assetContainer'],
      backgroundColor: getCardColor(colors.assetContainerBackground, isSelected, status),
    },
    assetStyle: styles['asset'],
    labelStyle: {
      ...styles['label'],
      ...(isSelected ? styles['labelSelected'] : {}),
      backgroundColor: getCardColor(colors.labelBackground, isSelected, status),
      color: isSelected ? palette.text.black : palette.text.primary,
    },
  };
}
