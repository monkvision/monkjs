import { Platform } from 'react-native';

const SPACING_BASE = 8;
const nativeSpacing = (spacingFactor = 1) => SPACING_BASE * spacingFactor;
const defaultSpacing = (spacingFactor) => `${nativeSpacing(spacingFactor)}px`;

export const spacing = Platform.select({
  native: nativeSpacing,
  default: defaultSpacing,
});

const theme = {
  colors: {
    primary: '#274b9f',

    '--ifm-color-primary': '#274b9f',
    '--ifm-color-primary-dark': '#23438f',
    '--ifm-color-primary-darker': '#214087',
    '--ifm-color-primary-darkest': '#1b346f',
    '--ifm-color-primary-light': '#2b52af',
    '--ifm-color-primary-lighter': '#2d56b7',
    '--ifm-color-primary-lightest': '#3462cd',

    accent: '#7af7ff',
    success: '#5ccc68',
    warning: '#ff9800',
    error: '#fa603d',
    info: '#bbbdbf',
    primaryContrastText: '#ffffff',
  },
  spacing,
};

export default theme;
