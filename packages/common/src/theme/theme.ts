import { Color, ColorProp, MonkPalette, MonkTheme, ThemeUtils } from '@monkvision/types';
import { CSSProperties } from 'react';
import { MonkDefaultPalette } from './default';

function createGetColor(palette: MonkPalette): (prop: ColorProp) => Color {
  return (prop: ColorProp) => {
    const split = prop.split('-');
    const colorName = split[0] as keyof MonkPalette;
    const variantName = (split[1] ?? 'base') as keyof MonkPalette[keyof MonkPalette];
    return palette[colorName] && palette[colorName][variantName]
      ? palette[colorName][variantName]
      : prop;
  };
}

function createThemeUtils(palette: MonkPalette): ThemeUtils {
  return {
    getColor: createGetColor(palette),
  };
}

function createRootStyles(palette: MonkPalette): CSSProperties {
  return {
    backgroundColor: palette.background.base,
    color: palette.text.white,
  };
}

/**
 * Optional parameters that can be passed to the createTheme function.
 */
export interface CreateThemeParams {
  /**
   * Partial color palette to use in the app. Missing colors will be filled using the default color palette.
   */
  palette?: Partial<MonkPalette>;
}

/**
 * Helper function used to create a MonkTheme by filling the missing values (such as colors etc.) with the ones used in
 * the default Monk theme.
 *
 * @param [theme] Optional custom values for the theme.
 */
export function createTheme({ palette }: CreateThemeParams = {}): MonkTheme {
  const themePalette: MonkPalette = {
    ...MonkDefaultPalette,
    ...(palette ?? {}),
  };
  return {
    palette: themePalette,
    utils: createThemeUtils(themePalette),
    rootStyles: createRootStyles(themePalette),
  };
}
