import dotenv from 'dotenv';

const env = dotenv.config().parsed;

export default {
  name: 'monk',
  slug: 'monk',
  version: '1.0.0',
  owner: 'monkvision',
  primaryColor: '#274b9f',
  privacy: 'hidden',
  scheme: 'monk',

  orientation: 'portrait',
  icon: './assets/icon.png',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#274b9f',
  },

  updates: {
    fallbackToCacheTimeout: 0,
  },

  assetBundlePatterns: [
    '**/*',
  ],

  ios: {
    bundleIdentifier: 'com.monkvision.adrian',
    buildNumber: '0.0.1',
    supportsTablet: true,
    requireFullScreen: true,
  },

  android: {
    package: 'com.monkvision.adrian',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#274b9f',
    },
  },

  androidStatusBar: {
    barStyle: 'light-content',
  },

  web: {
    favicon: './assets/favicon.png',
  },

  extra: { ...env },
};
