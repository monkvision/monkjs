import eas from './eas.json';
import palette from './palettes/monk-theme.json';

const buildNumber = 1;

const app = {
  name: 'Monk Capture Application',
  shortName: 'MCA',
  companyName: 'Monk',
  logo: {
    source: {
      uri: 'https://i0.wp.com/monk.ai/wp/wp-content/uploads/2020/06/monk-logo-white-2x.png',
      // uri: 'https://www.pinclipart.com/picdir/middle/381-3818109_emr-group-emr-recycling-clipart.png',
      // uri: 'https://assets-global.website-files.com/622762ff70941ce65ae7d712/622762ff70941ce7c2e7d850_ACVLogoGradient_DarkBKGD-p-500.png',
    },
    width: 160,
    height: 71,
  },
  themeColor: palette['color-primary-500'],
  description: 'Monk Capture App enables high level car inspections with helpers and specific user interfaces.',
};

const options = [
  {
    value: 'vinNumber',
    title: 'inspection.vinNumber.title',
    description: 'inspection.vinNumber.description',
    icon: 'car-info',
    mode: ['automatic', 'manually'], // default to automatic
    sightIds: [
      'sLu0CfOt', // Vin number
    ],
    taskName: 'images_ocr',
  },
  {
    value: 'car360',
    title: 'inspection.damageDetection.title',
    description: 'inspection.damageDetection.description',
    icon: 'axis-z-rotate-counterclockwise',
    sightIds: [
      'vwtroc-vLcBGkeh', // Front
      'vwtroc-xfbBpq3Q', // Front Bumper Side Left
      'vwtroc-xQKQ0bXS', // Front wheel left (Wheels analysis)
      'vwtroc-zjAIjUgU', // Front Lateral Left
      'vwtroc-T24v9XS8', // Front Door Left
      'vwtroc-UHZkpCuK', // Rocker panel left
      'vwtroc-ClEZSucK', // Rear Lateral Left
      'vwtroc-8_W2PO8L', // Rear wheel left (Wheels analysis)
      'vwtroc-j8YHvnDP', // Rear Bumper Side Left
      'vwtroc-XyeyZlaU', // Rear
      'vwtroc-LDRoAPnk', // Rear Bumper Side Right
      'vwtroc-rN39Y3HR', // Rear wheel right (Wheels analysis)
      'vwtroc-QqBpHiVP', // Rear Lateral Right
      'vwtroc-B5s1CWT-', // Rocker panel right
      'vwtroc-2wVqenwP', // Front Door Right
      'vwtroc-0U14gFyk', // Front Lateral Right
      'vwtroc-PuIw17h0', // Front wheel right (Wheels analysis)
      'vwtroc-CELBsvYD', // Front Bumper Side Right
    ],
    taskName: 'damage_detection',
  },
  // {
  //   value: 'commando',
  //   title: 'Data collection',
  //   description: '52 pictures to obtain max observation and result',
  //   icon: 'database',
  //   sightIds: [
  //     'sLu0CfOt',
  //     'PLh198NC', 'xsuH1g5T', 'xfbBpq3Q', 'm1rhrZ88', 'LE9h1xh0',
  //     'IVcF1dOP', 'xQKQ0bXS', 'T24v9XS8', 'VmFL3v2A', 'eOkUJUBk',
  //     'zjAIjUgU', 'GOQq1-nN', 'UHZkpCuK', '1-gwCM0m', 'ClEZSucK',
  //     'GvCtVnoD', '8_W2PO8L', 'dQOmxo13', 'OOJDJ7go', 'D4r9OKHt',
  //     '3vKXafwc', 'GHbWVnMB', 'j8YHvnDP', 'XyeyZlaU', 'LDRoAPnk',
  //     'j3E2UHFc', 'Cce1KCd3', '36qmcrgr', 'TDLex8-D', '2RFF3Uf8',
  //     'eWZsEThb', 'AoO-nOoM', 'QqBpHiVP', '6MR5C13s', 'rN39Y3HR',
  //     'B5s1CWT-', 'QJ_yOnBl', '0U14gFyk', 'WWZsroCu', 'enHQTFae',
  //     '2wVqenwP', 'PuIw17h0', 'Pzgw0WGe', 'jqJOb6Ov', 'CELBsvYD',
  //     'jgB-cu5G', 'EqLDVYj3', 'vLcBGkeh', 'Fh972HlF', 'RMeCZRbd',
  //     'oIk8RQ3w',
  //   ],
  //   taskName: 'damage_detection',
  // },
  // {
  //   value: 'wheels',
  //   title: 'inspection.wheelsAnalysis.title',
  //   description: 'inspection.wheelsAnalysis.description',
  //   icon: 'circle-double',
  //   sightIds: [
  //     'xQKQ0bXS', // Front wheel left
  //     '8_W2PO8L', // Rear wheel left
  //     'rN39Y3HR', // Rear wheel right
  //     'PuIw17h0', // Front wheel right
  //   ],
  //   taskName: 'wheel_analysis',
  // },
];

export default {
  version: '2.1.0',
  name: app.name,
  slug: 'cna',
  scheme: 'monk-cna',
  owner: 'monkvision',

  primaryColor: app.themeColor,
  backgroundColor: palette['color-background'],
  orientation: 'landscape',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',

  plugins: ['sentry-expo'],

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: palette['color-background'],
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
      backgroundColor: palette['color-background'],
    },
  },

  androidStatusBar: {
    barStyle: 'light-content',
  },

  androidNavigationBar: {
    visible: 'immersive',
    barStyle: 'light-content',
  },

  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'monk',
          project: 'app-native',
          authToken: 'bd32270ed42749aca5996f4a7793506bd7216a9ed9384cb688677a60f2b9c9ab',
          setCommits: true,
          url: 'https://sentry.dev.monk.ai',
        },
      },
    ],
  },

  web: {
    favicon: './assets/favicon.png',
    backgroundColor: palette['color-background'],
    display: 'fullscreen',
    orientation: 'landscape',
    lang: 'en-US',
    ...app,
  },
  extra: {
    options,
    theme: {
      dark: true,
      mode: 'adaptive',
      loaderDotsColors: [
        palette['color-primary-400'],
        palette['color-primary-300'],
        palette['color-primary-200'],
        palette['color-primary-100'],
      ],
      colors: {
        primary: app.themeColor,
        success: palette['color-success-500'],
        accent: palette['color-info-400'],
        info: palette['color-info-500'],
        warning: palette['color-warning-500'],
        danger: palette['color-danger-500'],
        gradient: palette['color-primary-900'],
        background: palette['color-background'],
        surface: palette['color-surface'],
        onSurface: palette['color-onSurface'],
        text: palette['color-text'],
        placeholder: palette['color-placeholder'],
        disabled: palette['color-disabled'],
        notification: palette['color-notification'],
      },
      palette,
    },
    ...app,
    ...eas.build.development.env,
  },
};
