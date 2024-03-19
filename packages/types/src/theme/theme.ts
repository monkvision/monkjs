import { CSSProperties } from 'react';
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
  /**
   * Root styles of the application that define global styles such as font color etc.
   */
  rootStyles: CSSProperties;
}
