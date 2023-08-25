import { MonkPalette } from './palette';
import { ThemeUtils } from './utils';

/**
 * Application theme used to customize the look and feel of the Monk SDK.
 */
export interface MonkTheme {
  /**
   * The color palette.
   */
  palette: MonkPalette;
  /**
   * Theme utils.
   */
  utils: ThemeUtils;
}
