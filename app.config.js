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
    MODEL_TFLITE_URL: 'https://embedded-models.dev.monk.ai/IQA/Multitask/2022-04-12-mobilevit_xs/v0/checkpoints/epoch_7-val_loss%3D0.023.ckpt.onnx.savedmodel.tflite',
    // API_DOMAIN: 'api.preview.monk.ai/v1',
    // AUTH_AUDIENCE: 'https://api.monk.ai/v1/',
    // AUTH_CLIENT_ID: 'soZ7P2c6b9I5jarQoRrhh87x9TpOSaGn',
    // AUTH_DOMAIN: 'idp.preview.monk.ai',
  },
};
