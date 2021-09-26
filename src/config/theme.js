import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

const SPACING_BASE = Constants.manifest.extra.APP_SPACING_BASE || 8;
const nativeSpacing = (spacingFactor = 1) => SPACING_BASE * spacingFactor;
const defaultSpacing = (spacingFactor) => `${nativeSpacing(spacingFactor)}px`;

export const spacing = Platform.select({
  native: nativeSpacing,
  default: defaultSpacing,
});

const theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Constants.manifest.extra.APP_COLOR,

    '--ifm-color-primary': '#274b9f',
    '--ifm-color-primary-dark': '#23438f',
    '--ifm-color-primary-darker': '#214087',
    '--ifm-color-primary-darkest': '#1b346f',
    '--ifm-color-primary-light': '#2b52af',
    '--ifm-color-primary-lighter': '#2d56b7',
    '--ifm-color-primary-lightest': '#3462cd',

    accent: Constants.manifest.extra.APP_ACCENT_COLOR,
    success: '#5ccc68',
    warning: '#ff9800',
    error: '#fa603d',
    info: '#bbbdbf',
    primaryContrastText: '#ffffff',
  },
  spacing,
};

export default theme;
