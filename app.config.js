import eas from './eas.json';

const buildNumber = 1;

const app = {
  name: 'Monk Capture Web Application',
  shortName: 'MCWA',
  themeColor: '#2B52BE',
  description: 'Monk Capture App enables high level car inspections with helpers and specific user interfaces.',
};
const backgroundColor = '#181829';

const options = [{
  value: 'vinNumber',
  title: 'VIN recognition',
  description: 'Vehicle info obtained from OCR',
  icon: 'car-info',
  sightIds: [
    'sLu0CfOt', // Vin number
  ],
  taskName: 'images_ocr',
}, {
  value: 'car360',
  title: 'Damage detection',
  description: 'Vehicle tour (exterior and interior)',
  icon: 'axis-z-rotate-counterclockwise',
  sightIds: [
    'WKJlxkiF', // Beauty Shot
    'vxRr9chD', // Front Bumper Side Left
    'cDe2q69X', // Front Fender Left
    'R_f4g8MN', // Doors Left
    'vedHBC2n', // Front Roof Left
    'McR3TJK0', // Rear Lateral Left
    '7bTC-nGS', // Rear Fender Left
    'hhCBI9oZ', // Rear
    'e_QIW30o', // Rear Fender Right
    'fDo5M0Fp', // Rear Lateral Right
    'fDKWkHHp', // Doors Right
    '5CFsFvj7', // Front Fender Right
    'g30kyiVH', // Front Bumper Side Right
    'I0cOpT1e', // Front

    'IqwSM3', // Front seats
    'rj5mhm', // Back seats
    'qhKA2z', // Trunk
    'rSvk2C', // Dashboard
  ],
  taskName: 'damage_detection',
}, {
  value: 'commando',
  title: 'Data collection',
  description: '52 pictures to obtain max observation and result',
  icon: 'database',
  sightIds: [
    'sLu0CfOt',
    'PLh198NC', 'xsuH1g5T', 'xfbBpq3Q', 'm1rhrZ88', 'LE9h1xh0',
    'IVcF1dOP', 'xQKQ0bXS', 'T24v9XS8', 'VmFL3v2A', 'eOkUJUBk',
    'zjAIjUgU', 'GOQq1-nN', 'UHZkpCuK', '1-gwCM0m', 'ClEZSucK',
    'GvCtVnoD', '8_W2PO8L', 'dQOmxo13', 'OOJDJ7go', 'D4r9OKHt',
    '3vKXafwc', 'GHbWVnMB', 'j8YHvnDP', 'XyeyZlaU', 'LDRoAPnk',
    'j3E2UHFc', 'Cce1KCd3', '36qmcrgr', 'TDLex8-D', '2RFF3Uf8',
    'eWZsEThb', 'AoO-nOoM', 'QqBpHiVP', '6MR5C13s', 'rN39Y3HR',
    'B5s1CWT-', 'QJ_yOnBl', '0U14gFyk', 'WWZsroCu', 'enHQTFae',
    '2wVqenwP', 'PuIw17h0', 'Pzgw0WGe', 'jqJOb6Ov', 'CELBsvYD',
    'jgB-cu5G', 'EqLDVYj3', 'vLcBGkeh', 'Fh972HlF', 'RMeCZRbd',
    'oIk8RQ3w',
  ],
  taskName: 'damage_detection',
}, {
  value: 'wheels',
  title: 'Wheels analysis',
  description: 'Details about rims condition',
  icon: 'circle-double',
  sightIds: [
    'xQKQ0bXS', // Front wheel left
    '8_W2PO8L', // Rear wheel left
    'rN39Y3HR', // Rear wheel right
    'PuIw17h0', // Front wheel right
  ],
  taskName: 'wheel_analysis',
}];

export default {
  version: '2.1.0',
  name: app.name,
  slug: 'cna',
  scheme: 'monk-cna',
  owner: 'monkvision',

  primaryColor: app.themeColor,
  backgroundColor: '#000000',
  orientation: 'landscape',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',

  plugins: ['sentry-expo'],

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor,
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
      backgroundColor,
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
    backgroundColor,
    display: 'fullscreen',
    orientation: 'landscape',
    lang: 'en-US',
    ...app,
  },
  extra: {
    backgroundColor,
    options,
    ...eas.build.development.env,
  },
};
