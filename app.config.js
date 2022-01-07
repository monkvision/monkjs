const buildNumber = 1;

export default {
  name: 'monk',
  slug: 'monk',
  version: '1.2.3',
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
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
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
    API_DOMAIN: 'api.staging.monk.ai/v1',
    AUTH_AUDIENCE: 'https://api.monk.ai/v1/',
    AUTH_CLIENT_ID: 'DAeZWqeeOfgItYBcQzFeFwSrlvmUdN7L',
    AUTH_DOMAIN: 'idp.staging.monk.ai',
  },
};
