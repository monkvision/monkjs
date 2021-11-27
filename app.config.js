import dotenv from 'dotenv';

const env = dotenv.config().parsed;

export default {
  name: 'monk',
  slug: 'monk',
  version: '1.0.0',
  owner: 'monkvision',
  primaryColor: '#274b9f',
  privacy: 'unlisted',
  scheme: 'monk',

  orientation: 'portrait',
  icon: './assets/icon.png',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#f2f2f2',
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
      backgroundColor: '#f2f2f2',
    },
  },

  web: {
    favicon: './assets/favicon.png',
  },

  extra: { ...env },
};
