import eas from './eas.json';

const buildNumber = 44;

export default {
  version: '2.0.0',
  name: 'Monk Capture App',
  slug: 'mca',
  scheme: 'monk',
  owner: 'monkvision',

  primaryColor: '#2B52BE',
  backgroundColor: '#181829',
  orientation: 'landscape',
  icon: './assets/icon.png',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#181829',
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
      backgroundColor: '#181829',
    },
  },

  web: {
    favicon: './assets/favicon.png',
    backgroundColor: '#181829',
    display: 'fullscreen',
    orientation: 'landscape',
    lang: 'en-US',
    name: 'Monk Capture Application',
    shortName: 'MCA',
    themeColor: '#2B52BE',
    description: 'Monk Capture Application enables high level car inspections with helpers and specific user interfaces.',
  },

  extra: eas.build.development.env,
};
