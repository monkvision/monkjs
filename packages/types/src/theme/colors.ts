import { DashConcat } from '../utils';

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
   * Darkest text color for headings.
   */
  primary: Color;
  /**
   * Second-darkest text color for subtitles.
   */
  secondary: Color;
  /**
   * Mid-dark text color for body text.
   */
  tertiary: Color;
  /**
   * Second-lightest text color for disabled elements.
   */
  disable: Color;
  /**
   * Lightest text color for "white" text.
   */
  white: Color;
}

/**
 * Color variants for text link elements.
 */
export interface TextLinkColorVariants {
  /**
   * Color for link elements that are displayed on top of light elements.
   */
  onLight: Color;
  /**
   * Color for link elements that are displayed on top of dark elements.
   */
  onDark: Color;
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
  /**
   * Lightest variant of the background color, considered to be the "white" of the application.
   */
  white: Color;
}

/**
 * Surface colors used for element backgrounds. Surface 1 being the darkest, and surface 5 the lightest.
 */
export interface SurfaceColorVariants {
  /**
   * Background surface color.
   */
  bg: Color;
  /**
   * Color of the surface with elevation 1.
   */
  s1: Color;
  /**
   * Color of the surface with elevation 2.
   */
  s2: Color;
  /**
   * Color of the surface with elevation 3.
   */
  s3: Color;
  /**
   * Color of the surface with elevation 4.
   */
  s4: Color;
  /**
   * Color of the surface with elevation 5.
   */
  s5: Color;
}

/**
 * Color variants for border elements.
 */
export interface BorderColorVariants {
  /**
   * Base variant for the color.
   */
  base: Color;
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
  | 'text-tertiary'
  | 'text-disable'
  | 'text-white';

/**
 * Union type for text color names.
 */
export type TextLinkColorName = 'textLink-onLight' | 'textLink-onDark';

/**
 * Union type for background color names.
 */
export type BackgroundColorName =
  | 'background-dark'
  | 'background-base'
  | 'background-light'
  | 'background-white';

/**
 * Union type for surface color names.
 */
export type SurfaceColorName =
  | 'surface-s1'
  | 'surface-s2'
  | 'surface-s3'
  | 'surface-s4'
  | 'surface-s5';

/**
 * Union type for border color names.
 */
export type BorderColorName = 'border-base';

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
  | TextLinkColorName
  | BackgroundColorName
  | SurfaceColorName
  | BorderColorName
  | OutlineColorName
  | 'transparent';

/**
 * A prop that can be passed to a Monk component for describing a color. The value can either be the name of the color
 * (ColorName type) or the hexcode of the color.
 */
export type ColorProp = ColorName | Color;
