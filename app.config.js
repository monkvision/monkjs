const buildNumber = 44;

export default {
  version: '1.2.3',
  name: 'monk',
  slug: 'monk',
  scheme: 'monk',
  owner: 'monkvision',

  primaryColor: '#274b9f',
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
    API_DOMAIN: 'api.dev.monk.ai/v1',
    AUTH_AUDIENCE: 'https://api.monk.ai/v1/',
    AUTH_CLIENT_ID: 'QNo7pxwM12UJbpmNs13EBOiAhi5evndz',
    AUTH_DOMAIN: 'idp.dev.monk.ai',
  },
};
