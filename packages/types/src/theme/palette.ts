import {
  AccentColorVariants,
  BackgroundColorVariants,
  OutlineColorVariants,
  SurfaceColorVariants,
  TextColorVariants,
} from './colors';

/**
 * A color palette that defines the color used in the application for light mode.
 */
export interface MonkPalette {
  /**
   * Color variants for the primary color of the application.
   */
  primary: AccentColorVariants;
  /**
   * Color variants for the secondary color of the application.
   */
  secondary: AccentColorVariants;
  /**
   * Color variants for the alert elements of the application. Usually this color is a red.
   */
  alert: AccentColorVariants;
  /**
   * Color variants for the caution elements of the application. Usually this color is an orange / yellow.
   */
  caution: AccentColorVariants;
  /**
   * Color variants for the success elements of the application. Usually this color is a green.
   */
  success: AccentColorVariants;
  /**
   * Color variants for the information elements of the application. Usually this color is a blue.
   */
  information: AccentColorVariants;
  /**
   * Color variants for the text elements of the application.
   */
  text: TextColorVariants;
  /**
   * Color variants for the application's backgrounds.
   */
  background: BackgroundColorVariants;
  /**
   * Color variants for the application's surfaces.
   */
  surface: SurfaceColorVariants;
  /**
   * Color variants for the application's outlines.
   */
  outline: OutlineColorVariants;
}
