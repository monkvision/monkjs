import { Color, ColorProp } from './colors';

/**
 * Utility functions that come included with the Monk theme.
 */
export interface ThemeUtils {
  /**
   * Utility function that takes a color from a prop (ColorProp object) and returns the corresponding color value. If
   * the prop is not a color name, it will be returned as is.
   *
   * @param prop The color prop.
   * @return The value of the color.
   */
  getColor: (prop: ColorProp) => Color;
}
