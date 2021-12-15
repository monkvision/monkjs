import isEmpty from 'lodash.isempty';
import { Dimensions, Platform } from 'react-native';

const flex = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  ...Platform.select({
    native: { flex: 1 },
    default: { display: 'flex', flexGrow: 1, height: '100vh' },
  }),
};
const RATIO_FACTOR = 240;
const makeRatio = (width, height) => `${width / RATIO_FACTOR}:${height / RATIO_FACTOR}`;

function getContainedSizes(ratio) {
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

function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

const SPACING_BASE = 8;
const nativeSpacing = (spacingFactor = 1) => SPACING_BASE * spacingFactor;
const defaultSpacing = (spacingFactor) => `${nativeSpacing(spacingFactor)}px`;

const spacing = Platform.select({
  native: nativeSpacing,
  default: defaultSpacing,
});

export default {
  styles: {
    spacing,
    flex,
    getContainedSizes,
  },
  makeRatio,
  getOS,
};
