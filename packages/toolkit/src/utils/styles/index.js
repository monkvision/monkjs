import { Dimensions, Platform } from 'react-native';
import isEmpty from 'lodash.isempty';

export const shadow = (elevation = 5, opacity = 0.2) => Platform.select({
  web: {
    boxShadow: `rgb(0 0 0 / ${opacity * 100}%) 0px 3px ${elevation}px -1px, rgb(0 0 0 / ${opacity * 50}%) 0px ${elevation}px 8px 0px, rgb(0 0 0 / ${opacity * 40}%) 0px 1px 10px 0px`,
  },
  native: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Math.floor(elevation / 2),
    },
    shadowOpacity: opacity,
    shadowRadius: (elevation / 2) - 1,
    elevation,
  },
});

const SPACING_BASE = 8;
const nativeSpacing = (spacingFactor = 1) => SPACING_BASE * spacingFactor;
const defaultSpacing = (spacingFactor) => `${nativeSpacing(spacingFactor)}px`;

export const spacing = Platform.select({
  native: nativeSpacing,
  default: defaultSpacing,
});

export const flex = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  ...Platform.select({
    native: { flex: 1 },
    default: { display: 'flex', flexGrow: 1, height: '100vh' },
  }),
};

export function getContainedSizes(ratio) {
  if (isEmpty(ratio)) { return {}; }
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const [a, b] = ratio.split(':').sort((c, d) => (c + d));
  const longest = windowHeight <= windowWidth ? windowHeight : windowWidth;

  return {
    ...Platform.select({
      native: {
        height: longest,
        width: longest * (a / b),
      },
      default: {
        height: '100vh',
        width: `${Math.floor(100 * (a / b))}vh`,
      },
    }),
  };
}
