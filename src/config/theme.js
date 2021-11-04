import { Platform } from 'react-native';

const SPACING_BASE = 8;
const nativeSpacing = (spacingFactor = 1) => SPACING_BASE * spacingFactor;
const defaultSpacing = (spacingFactor) => `${nativeSpacing(spacingFactor)}px`;

// eslint-disable-next-line import/prefer-default-export
export const spacing = Platform.select({
  native: nativeSpacing,
  default: defaultSpacing,
});
