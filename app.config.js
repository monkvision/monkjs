import eas from './eas.json';

const buildNumber = 44;

export default {
  version: '2.0.0',
  name: 'Monk Capture App',
  slug: 'mca',
  scheme: 'monk',
  owner: 'monkvision',

  primaryColor: '#274b9f',
  orientation: 'landscape',
  icon: './assets/icon.png',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#202020',
  },

  ios: {
    bundleIdentifier: 'com.monkvision.adrian',
    supportsTablet: true,
    requireFullScreen: true,
    buildNumber: `${buildNumber}`,
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
  },

  android: {
    package: 'com.monkvision.adrian',
    versionCode: buildNumber,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#202020',
    },
  },

  web: {
    favicon: './assets/favicon.png',
  },

  extra: eas.build.development.env,
};
