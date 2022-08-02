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
    sightIds: {
      suv: [
        'jgc21-zCrDwYWE',
        'jgc21-VHq_6BM-',
        'jgc21-QIkcNhc_', // not working
        'jgc21-imomJ2V0',
        'jgc21-5lovhZgA',
        'jgc21-ESc0HCzy',
        'jgc21-ezXzTRkj',
        'jgc21-tbF2Ax8v',
        'jgc21-3JJvM7_B',
        'jgc21-JerG7oW5', // not working
        'jgc21-0QM-q8k5',
        'jgc21-QwNQX0Cr',
        'jgc21-__JKllz9', // not working
        'jgc21-QIvfeg0X', // not working
        'jgc21-KyUUVU2P',
      ],
      cuv: [
        'fesc20-LTe3X2bg',
        'fesc20-bD8CBhYZ',
        'fesc20-GdIxD-_N', // not working
        'fesc20-6GPUkfYn',
        'fesc20-iUN0g_Zn',
        'fesc20-P470Q-jm',
        'fesc20-dfICsfSV', // not working
        'fesc20-X8k7UFGf',
        'fesc20-LZc7p2kK',
        'fesc20-r_UeXQRO',
        'fesc20-xDFQNR3C',
        'fesc20-CEGtqHkk',
        'fesc20-Wzdtgqqz',
        'fesc20-H1dfdfvH',
        'fesc20-WMUaKDp1',
      ],
      sedan: [
        'haccord-hsCc_Nct',
        'haccord-huAZfQJA', // not working
        'haccord-2a8VfA8m',
        'haccord-oiY_yPTR',
        'haccord-bg-RFHl_',
        'haccord-Qel0qUky',
        'haccord-GdWvsqrm', // not working
        'haccord-ps7cWy6K',
        'haccord-Jq65fyD4',
        'haccord-sorgeRJ7',
        'haccord-d3VJTvYw',
        'haccord-EfRIciFr', // not working
        'haccord-Z84erkMb',
        'haccord-8YjMcu0D',
        'haccord-DUPnw5jj',
      ],
      hatchback: [
        'ffocus18-43ljK5xC',
        'ffocus18-GgOSpLl6',
        'ffocus18-GiTxaJUq',
        'ffocus18-ZXKOomlv', // not working
        'ffocus18-L_oZ0LyK',
        'ffocus18-vFR9PKjB',
        'ffocus18-9MeSIqp7', // not working
        'ffocus18-X2LDjCvr',
        'ffocus18-jWOq2CNN', // not working
        'ffocus18-Wo8PkcLF',
        'ffocus18-D_QaaCTd',
        'ffocus18-zgLKB-Do',
        'ffocus18-lRDlWiwR',
        'ffocus18-XlfgjQb9',
        'ffocus18-3TiCVAaN',
      ],
      van: [
        'ftransit18-5SiNC94w',
        'ftransit18-ffghVsNz',
        'ftransit18-6X8IAjy0', // not working
        'ftransit18-pd2Q_O9P',
        'ftransit18-klUp8BS4',
        'ftransit18-iu1Vj2Oa',
        'ftransit18-aA2K898S',
        'ftransit18-NwBMLo3Z',
        'ftransit18-cf0e-pcB',
        'ftransit18-FFP5b34o',
        'ftransit18-qmLP7A-b',
        'ftransit18-sLAPXyG8',
        'ftransit18-E7DAv47J',
        'ftransit18-IIVI_pnX', // not working
        'ftransit18-wyXf7MTv',
        'ftransit18-UNAZWJ-r',
      ],
      minivan: [
        'tsienna20-TI4TVvT9', // not working
        'tsienna20-jY3cR5vy',
        'tsienna20-gkvZE2c7',
        'tsienna20-is1tpnqR',
        'tsienna20-D6pPBrXx',
        'tsienna20-ouPvuX-j',
        'tsienna20-1n_z8bYy',
        'tsienna20-qA3aAUUq',
        'tsienna20--a2RmRcs',
        'tsienna20-QIMXlb0L', // not working
        'tsienna20-g2uWI1l8', // not working
        'tsienna20-xtDcn3GS',
        'tsienna20-KHB_Cd9k',
        'tsienna20-YwrRNr9n',
        'tsienna20-HykkFbXf',
      ],
      pickup: [
        'ff150-KgHVkQBW', // not working
        'ff150-7UI3m9B3',
        'ff150-wO_fJ3DL',
        'ff150-Ttsc7q6V',
        'ff150-_AoeFdVO',
        'ff150-xbOhu7nK',
        'ff150--xPZZd83',
        'ff150-nF_oFvhI', // not working
        'ff150-t3KBMPeD',
        'ff150-2WUJ179s',
        'ff150-o8MiTw8u',
        'ff150-OviO2DlY', // not working
        'ff150-gFp78fQO',
        'ff150-zXbg0l3z', // not working
        'ff150-3he9UOwy',
      ],
    },
    taskName: 'damage_detection',
  },
  {
    value: 'interior',
    title: 'inspection.interior.title',
    description: 'inspection.interior.description',
    icon: 'car-seat',
    sightIds: [
      'IqwSM3', // Front seats
      'rj5mhm', // Back seats
      'qhKA2z', // Trunk
      'rSvk2C', // Dashboard
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
  {
    value: 'wheels',
    title: 'inspection.wheelsAnalysis.title',
    description: 'inspection.wheelsAnalysis.description',
    icon: 'circle-double',
    sightIds: [
      'xQKQ0bXS', // Front wheel left
      '8_W2PO8L', // Rear wheel left
      'rN39Y3HR', // Rear wheel right
      'PuIw17h0', // Front wheel right
    ],
    taskName: 'wheel_analysis',
  },
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
