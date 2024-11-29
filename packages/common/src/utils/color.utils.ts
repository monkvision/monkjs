import { InteractiveStatus, RGBA } from '@monkvision/types';
import { SVGProps } from 'react';

const RGBA_REGEXP = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)$/i;
const HEX_REGEXP = /^#(?:(?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})$/i;

function getRGBAFromRGBAString(str: string): RGBA | null {
  const result = str.match(RGBA_REGEXP);
  if (!result) {
    return null;
  }
  return {
    r: Number(result[1]),
    g: Number(result[2]),
    b: Number(result[3]),
    a: result[4] ? Number(result[4]) : 1,
  };
}

function getRGBAFromHexString(str: string): RGBA | null {
  if (!HEX_REGEXP.test(str)) {
    return null;
  }
  let colors = [];
  const increment = str.length > 5 ? 2 : 1;
  for (let i = 1; i < str.length; i += increment) {
    colors.push(str.substring(i, i + increment));
  }
  colors = colors.map((hex) => parseInt(hex.length > 1 ? hex : `${hex}${hex}`, 16));
  return {
    r: colors[0],
    g: colors[1],
    b: colors[2],
    a: (colors[3] ?? 255) / 255,
  };
}

function convertColorToHexCode(value: number): string {
  let rounded = Math.round(value);
  rounded = rounded > 255 ? 255 : rounded;
  const hex = rounded.toString(16);
  return hex.length > 1 ? hex : `0${hex}`;
}

/**
 * Returns the RGBA values of the given color. The accepted formats are :
 * - RGB : rgb(167, 224, 146)
 * - RGBA : rgb(167, 224, 146, 0.03)
 * - HEX : #A7E092
 * - HEX (alpha) : #A7E09208
 * - HEX (short) : #AE9
 * - HEX (short + alpha) : #AE98
 *
 * This function is case-insensitive and ignores white spaces.
 */
export function getRGBAFromString(str: string): RGBA {
  const trimmed = str.trim();
  const result =
    trimmed.length > 9 ? getRGBAFromRGBAString(trimmed) : getRGBAFromHexString(trimmed);
  if (!result) {
    throw new Error(`Invalid color format : ${trimmed}`);
  }
  return result;
}

/**
 * Converts RGBA values to their hexadecimal representation.
 */
export function getHexFromRGBA(rgba: RGBA): string {
  const r = convertColorToHexCode(rgba.r);
  const g = convertColorToHexCode(rgba.g);
  const b = convertColorToHexCode(rgba.b);
  const a = convertColorToHexCode(rgba.a * 255);
  return `#${r}${g}${b}${a}`;
}

/**
 * Apply a shade of black or white over the given color.
 *
 * @param color A color using the same format accepted by the `getRGBAFromString` function.
 * @param amount The amount of shade to apply, as a ratio :
 * - positive values like 0.08 to lighten the color by 8%
 * - negative values like -0.08 to darken the color by 8%
 * @see getRGBAFromString
 */
export function shadeColor(color: string, amount: number): string {
  const { a, ...rgb } = getRGBAFromString(color);
  Object.entries(rgb).forEach(([key, value]) => {
    const shaded = value * (1 + amount);
    rgb[key as keyof typeof rgb] = shaded > 255 ? 255 : shaded;
  });
  return getHexFromRGBA({ a, ...rgb });
}

/**
 * Returns a new color equal to the given color but with a different alpha value.
 *
 * @param color The color to change the alpha value of.
 * @param amount The alpha value (from 0 to 1).
 */
export function changeAlpha(color: string, amount: number): string {
  const { a: _, ...rgb } = getRGBAFromString(color);
  return getHexFromRGBA({ a: amount, ...rgb });
}

/**
 * The different ways an interactive element's style is altered when the user interacts with it.
 */
export enum InteractiveVariation {
  /**
   * The element will darken when the user interacts with it (used for light elements).
   */
  DARKEN = 'darken',
  /**
   * The element will lighten when the user interacts with it (used for dark elements).
   */
  LIGHTEN = 'lighten',
}

/**
 * Create interactive variants (hovered, active...) for the given color.
 */
export function getInteractiveVariants(
  color: string,
  variant = InteractiveVariation.LIGHTEN,
): Record<InteractiveStatus, string> {
  const factor = variant === InteractiveVariation.LIGHTEN ? 1 : -1;
  return {
    [InteractiveStatus.DEFAULT]: color,
    [InteractiveStatus.HOVERED]: shadeColor(color, factor * 0.08),
    [InteractiveStatus.ACTIVE]: shadeColor(color, factor * 0.12),
    [InteractiveStatus.DISABLED]: color,
  };
}

const COLOR_ATTRIBUTES = ['fill', 'stroke'];

/**
 * This utility function can be passed to the `DynamicSVG` component's `getAttributes` prop to completely color an SVG
 * with the given color. This is useful when wanting to color a single-color icon or logo.
 *
 * @example
 * function TestComponent() {
 *   const getAttributes = useCallback((element: Element) => fullyColorSVG(element, '#FFFFFF'), []);
 *   return (
 *     <DynamicSVG svg={logoSVG} getAttributes={getAttributes} />
 *   );
 * }
 */
export function fullyColorSVG(element: Element, color: string): SVGProps<SVGElement> {
  return COLOR_ATTRIBUTES.reduce((customAttributes, colorAttribute) => {
    const attr = element.getAttribute(colorAttribute);
    if (attr && !['transparent', 'none'].includes(attr)) {
      return {
        ...customAttributes,
        [colorAttribute]: color,
      };
    }
    return customAttributes;
  }, {});
}
