import { DashConcat } from '../typeUtils';

/**
 * Type definition for a color code. For now, this type is just an alias for `string`.
 */
export type Color = string;

/**
 * Color variants for an application accent color.
 */
export interface AccentColorVariants {
  /**
   * Darkest color variant for background, pressed or active items.
   */
  xdark: Color;
  /**
   * Dark color variant for hover items.
   */
  dark: Color;
  /**
   * Base color variant.
   */
  base: Color;
  /**
   * Light color variant.
   */
  light: Color;
  /**
   * Lightest color variant.
   */
  xlight: Color;
}

/**
 * Color variants for text elements.
 */
export interface TextColorVariants {
  /**
   * Main text color.
   */
  primary: Color;
  /**
   * Darker text color.
   */
  secondary: Color;
  /**
   * Text color for disabled elements.
   */
  disabled: Color;
  /**
   * Lightest text color for "pure white" text.
   */
  white: Color;
  /**
   * Darkest text color for "pure black" text.
   */
  black: Color;
  /**
   * Text color for link elements.
   */
  link: Color;
  /**
   * Secondary text color for link elements.
   */
  linkInverted: Color;
}

/**
 * Color variants for background elements.
 */
export interface BackgroundColorVariants {
  /**
   * Dark variant of the background color.
   */
  dark: Color;
  /**
   * Default background color.
   */
  base: Color;
  /**
   * Light variant of the background color.
   */
  light: Color;
}

/**
 * Surface colors used for surface element backgrounds.
 */
export interface SurfaceColorVariants {
  /**
   * Background color for dark surfaces.
   */
  dark: Color;
  /**
   * Background color for light surfaces.
   */
  light: Color;
}

/**
 * Color variants for outline elements.
 */
export interface OutlineColorVariants {
  /**
   * Base variant for the outline.
   */
  base: Color;
}

/**
 * Union type for the different accent colors base names available in a Monk palette.
 */
export type BaseAccentColorName =
  | 'primary'
  | 'secondary'
  | 'alert'
  | 'caution'
  | 'success'
  | 'information'
  | 'grey';

/**
 * Variant names for accent colors.
 */
export type AccentColorVariant = 'xdark' | 'dark' | 'base' | 'light' | 'xlight';

/**
 * A valid name for an accent color. Includes base names as well as names with variants.
 */
export type AccentColorName =
  | BaseAccentColorName
  | DashConcat<BaseAccentColorName, AccentColorVariant>;

/**
 * Union type for text color names.
 */
export type TextColorName =
  | 'text-primary'
  | 'text-secondary'
  | 'text-disabled'
  | 'text-white'
  | 'text-black'
  | 'text-link'
  | 'text-linkInverted';

/**
 * Union type for background color names.
 */
export type BackgroundColorName = 'background-dark' | 'background-base' | 'background-light';

/**
 * Union type for surface color names.
 */
export type SurfaceColorName = 'surface-dark' | 'surface-light';

/**
 * Union type for outline color names.
 */
export type OutlineColorName = 'outline-base';

/**
 * Union type for color names in the application. You can use this type as a prop validator if you want to allow
 * developers to pass a color as a string name directly.
 */
export type ColorName =
  | AccentColorName
  | TextColorName
  | BackgroundColorName
  | SurfaceColorName
  | OutlineColorName
  | 'transparent';

/**
 * A prop that can be passed to a Monk component for describing a color. The value can either be the name of the color
 * (ColorName type) or the hexcode of the color.
 */
export type ColorProp = ColorName | Color;

/**
 * Object containing the color component (red, green, blue) values of a color.
 */
export interface RGB {
  /**
   * The red component (from 0 to 255).
   */
  r: number;
  /**
   * The green component (from 0 to 255).
   */
  g: number;
  /**
   * The blue component (from 0 to 255).
   */
  b: number;
}

/**
 * Object containing the color component (red, green, blue) values of a color as well as its alpha value.
 */
export interface RGBA extends RGB {
  /**
   * The alpha value of the color (from 0 to 1).
   */
  a: number;
}
