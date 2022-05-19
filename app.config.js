import eas from './eas.json';

const buildNumber = 1;

export default {
  version: '2.1.0',
  name: 'Monk Capture Native App',
  slug: 'cna',
  scheme: 'monk-cna',
  owner: 'monkvision',

  primaryColor: '#2B52BE',
  backgroundColor: '#000000',
  orientation: 'landscape',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',

  plugins: ['sentry-expo'],

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#181829',
  },

  ios: {
    bundleIdentifier: 'ai.monk.cna',
    supportsTablet: true,
    requireFullScreen: true,
    buildNumber: `${buildNumber}`,
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
  },

  android: {
    package: 'ai.monk.cna',
    versionCode: buildNumber,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#181829',
    },
  },

  androidStatusBar: {
    barStyle: 'light-content',
  },

  androidNavigationBar: {
    visible: 'immersive',
    barStyle: 'light-content',
  },

  web: {
    favicon: './assets/favicon.png',
    backgroundColor: '#181829',
    display: 'fullscreen',
    orientation: 'landscape',
    lang: 'en-US',
    name: 'Monk Capture Web Application',
    shortName: 'MCWA',
    themeColor: '#2B52BE',
    description: 'Monk Capture App enables high level car inspections with helpers and specific user interfaces.',
  },

  extra: eas.build.development.env,
};
