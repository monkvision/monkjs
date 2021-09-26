import dotenv from 'dotenv';

const env = dotenv.config().parsed;

export default {
  name: process.env.APP_NAME,
  slug: process.env.APP_SLUG,
  version: process.env.APP_VERSION || '1.0.0',
  owner: process.env.OWNER,
  primaryColor: process.env.APP_COLOR,
  privacy: process.env.APP_PRIVACY,
  scheme: process.env.APP_SLUG,

  orientation: 'portrait',
  icon: './assets/icon.png',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: process.env.APP_COLOR,
  },

  updates: {
    fallbackToCacheTimeout: 0,
  },

  assetBundlePatterns: [
    '**/*',
  ],

  ios: {
    bundleIdentifier: process.env.APP_IOS_PACKAGE,
    buildNumber: '0.0.1',
    supportsTablet: true,
    requireFullScreen: true,
  },

  android: {
    package: process.env.APP_ANDROID_PACKAGE,
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: process.env.APP_COLOR,
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
