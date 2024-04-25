import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { useMemo } from 'react';
import { styles } from './InspectionGalleryFilterPill.styles';
import { ButtonShade } from '../../../Button/hooks';

export interface InspectionGalleryFilterPillStylesParams {
  isSelected: boolean;
}

export function useInspectionGalleryFilterPillStyles({
  isSelected,
}: InspectionGalleryFilterPillStylesParams) {
  const { palette } = useMonkTheme();

  const colors = useMemo(
    () => ({
      unselectedPillBackground: changeAlpha(palette.surface.dark, 0.32),
      unselectedCountBackground: changeAlpha(palette.surface.light, 0.08),
      selectedCountBackground: changeAlpha(palette.surface.dark, 0.08),
    }),
    [palette],
  );

  return {
    pill: {
      style: styles['pill'],
      primaryColor: isSelected ? palette.surface.light : colors.unselectedPillBackground,
      secondaryColor: isSelected ? palette.surface.dark : palette.text.primary,
      shade: (isSelected ? 'light' : 'dark') as ButtonShade,
    },
    countStyle: {
      ...styles['count'],
      backgroundColor: isSelected
        ? colors.selectedCountBackground
        : colors.unselectedCountBackground,
    },
  };
}
