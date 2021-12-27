const buildNumber = 7;

export default {
  name: 'monk',
  slug: 'monk',
  version: '1.0.0',
  owner: 'monkvision',
  primaryColor: '#274b9f',
  scheme: 'monk',

  orientation: 'portrait',
  icon: './assets/icon.png',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#f2f2f2',
  },

  ios: {
    bundleIdentifier: 'com.monkvision.adrian',
    supportsTablet: true,
    requireFullScreen: true,
    buildNumber: `${buildNumber}`,
  },

  android: {
    package: 'com.monkvision.adrian',
    versionCode: buildNumber,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#f2f2f2',
    },
  },

  web: {
    favicon: './assets/favicon.png',
  },

  extra: {
    ENV: 'development',
    AUTH_DOMAIN: 'idp.staging.monk.ai',
    AUTH_AUDIENCE: 'https://api.monk.ai/v1/',
    AUTH_CLIENT_ID: 'DAeZWqeeOfgItYBcQzFeFwSrlvmUdN7L',
    API_DOMAIN: 'api.staging.monk.ai/v1',
  },
};
