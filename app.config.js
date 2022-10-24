import eas from './eas.json';
import palette from './palettes/acv-theme.json';

const buildNumber = 1;

const app = {
  name: 'Monk Capture Application',
  shortName: 'MCA',
  companyName: 'Monk',
  logo: {
    source: {
      // uri: 'https://i0.wp.com/monk.ai/wp/wp-content/uploads/2020/06/monk-logo-white-2x.png',
      // uri: 'https://www.pinclipart.com/picdir/middle/381-3818109_emr-group-emr-recycling-clipart.png',
      uri: 'https://assets-global.website-files.com/622762ff70941ce65ae7d712/622762ff70941ce7c2e7d850_ACVLogoGradient_DarkBKGD-p-500.png',
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
        'jgc21-QIvfeg0X', // Front Low
        'jgc21-KyUUVU2P', // Hood
        'jgc21-zCrDwYWE', // Front Bumper Left
        'jgc21-VHq_6BM-', // Front Full Left
        'jgc21-z15ZdJL6', // Front Lateral Low Left
        'jgc21-imomJ2V0', // Front Roof Left
        'jgc21-omlus7Ui', // Lateral Low Left
        'jgc21-TEoi50Ff', // Lateral Full Left
        'jgc21-3gjMwvQG', // Rear Lateral Low Left
        'jgc21-Emzc8jJA', // Rear Full Left
        'jgc21-ezXzTRkj', // Rear Left
        'jgc21-tbF2Ax8v', // Rear
        'jgc21-TyJPUs8E', // Rear Low
        'jgc21-ZubJ48-U', // Rear Roof
        'jgc21-J1Ezdyar', // Rear Roof Right
        'jgc21-3JJvM7_B', // Rear Right
        'jgc21-2_5eHL-F', // Rear Full Right
        'jgc21-RAVpqaE4', // Rear Lateral Low Right
        'jgc21-1j-oTPag', // Lateral Full Right
        'jgc21-XXh8GWm8', // Lateral Low Right
        'jgc21-s7WDTRmE', // Front Lateral Low Right
        'jgc21-zkvFMHnS', // Front Full Right
        'jgc21-__JKllz9', // Front Bumper Right
      ],
      cuv: [
        'fesc20-H1dfdfvH', // Front Low
        'fesc20-WMUaKDp1', // Hood
        'fesc20-LTe3X2bg', // Front Bumper Left
        'fesc20-bD8CBhYZ', // Front Full Left
        'fesc20-WIQsf_gX', // Front Lateral Low Left
        'fesc20-6GPUkfYn', // Front Roof Left
        'fesc20-fOt832UV', // Lateral Low Left
        'fesc20-26n47kaO', // Lateral Full Left
        'fesc20-4Wqx52oU', // Rear Lateral Low Left
        'fesc20-T4dIGLgy', // Rear Full Left
        'fesc20-dfICsfSV', // Rear Left
        'fesc20-UjtbRtJS', // Rear
        'fesc20-xBFiEy-_', // Rear Low
        'fesc20-2bLRuhEQ', // Rear Roof
        'fesc20-DBLpo-52', // Rear Roof Right
        'fesc20-LZc7p2kK', // Rear Right
        'fesc20-EJ0tXYBW', // Rear Full Right
        'fesc20-5Ts1UkPT', // Rear Lateral Low Right
        'fesc20-HYz5ziHi', // Lateral Full Right
        'fesc20-P0oSEh8p', // Lateral Low Right
        'fesc20-dKVLig1i', // Front Lateral Low Right
        'fesc20-0mJeXBDf', // Front Full Right
        'fesc20-Wzdtgqqz', // Front Bumper Right
      ],
      sedan: [
        'haccord-8YjMcu0D', // Front Low
        'haccord-DUPnw5jj', // Hood
        'haccord-hsCc_Nct', // Front Bumper Left
        'haccord-huAZfQJA', // Front Full Left
        'haccord-GQcZz48C', // Front Lateral Low Left
        'haccord-oiY_yPTR', // Front Roof Left
        'haccord-mdZ7optI', // Lateral Low Left
        'haccord-_YnTubBA', // Lateral Full Left
        'haccord-W-Bn3bU1', // Rear Lateral Low Left
        'haccord-k6MiX2MR', // Rear Full Left
        'haccord-GdWvsqrm', // Rear Left
        'haccord-t5sLlmfv', // Rear
        'haccord-6kYUBv_e', // Rear Low
        'haccord-pplCo6sV', // Rear Roof
        'haccord-d_u3qyQ-', // Rear Roof Right
        'haccord-Jq65fyD4', // Rear Right
        'haccord-zNA0vVT0', // Rear Full Right
        'haccord-OXYy5gET', // Rear Lateral Low Right
        'haccord-PGr3RzzP', // Lateral Full Right
        'haccord-Gtt0JNQl', // Lateral Low Right
        'haccord-KN23XXkX', // Front Lateral Low Right
        'haccord-KvP-pm8L', // Front Full Right
        'haccord-Z84erkMb', // Front Bumper Right
      ],
      hatchback: [
        'ffocus18-XlfgjQb9', // Front Low
        'ffocus18-3TiCVAaN', // Hood
        'ffocus18-43ljK5xC', // Front Bumper Left
        'ffocus18-GgOSpLl6', // Front Full Left
        'ffocus18-x_1SE7X-', // Front Lateral Low Left
        'ffocus18-ZXKOomlv', // Front Roof Left
        'ffocus18-yo9eBDW6', // Lateral Low Left
        'ffocus18-6FX31ty1', // Lateral Full Left
        'ffocus18-S3kgFOBb', // Rear Lateral Low Left
        'ffocus18-IoqRrmlA', // Rear Full Left
        'ffocus18-9MeSIqp7', // Rear Left
        'ffocus18-e5netaNs', // Rear
        'ffocus18-L2UM_68Q', // Rear Low
        'ffocus18-p6mBZGcW', // Rear Roof
        'ffocus18-UBB7HoxF', // Rear Zoomed
        'ffocus18-iQvwc6wa', // Rear Roof Right
        'ffocus18-jWOq2CNN', // Rear Right
        'ffocus18-8WjvbtMD', // Rear Full Right
        'ffocus18-P2jFq1Ea', // Rear Lateral Low Right
        'ffocus18-FdsQDaTW', // Lateral Full Right
        'ffocus18-ts3buSD1', // Lateral Low Right
        'ffocus18-KkeGvT-F', // Front Lateral Low Right
        'ffocus18-seOy3jwd', // Front Full Right
        'ffocus18-lRDlWiwR', // Front Bumper Right
      ],
      van: [
        'ftransit18-wyXf7MTv', // Front Low
        'ftransit18-UNAZWJ-r', // Hood
        'ftransit18-5SiNC94w', // Front Bumper Left
        'ftransit18-ffghVsNz', // Front Full Left
        'ftransit18-Y0vPhBVF', // Front Lateral Low Left
        'ftransit18-6khKhof0', // Lateral Low Left
        'ftransit18-rsXWUN8X', // Lateral Full Left
        'ftransit18-3Sbfx_KZ', // Rear Lateral Low Left
        'ftransit18-y_wTc7ED', // Rear Full Left
        'ftransit18-iu1Vj2Oa', // Rear Left
        'ftransit18-aA2K898S', // Rear Up Left
        'ftransit18-NwBMLo3Z', // Rear
        'ftransit18-3dkU10af', // Rear Low
        'ftransit18-cf0e-pcB', // Rear Up Right
        'ftransit18-FFP5b34o', // Rear Right
        'ftransit18-f2W6pHaR', // Rear Full Right
        'ftransit18-RJ2D7DNz', // Rear Lateral Low Right
        'ftransit18-G24AdP6r', // Lateral Full Right
        'ftransit18-eztNpSRX', // Lateral Low Right
        'ftransit18-4NMPqEV6', // Front Lateral Low Right
        'ftransit18--w_ir_yH', // Front Full Right
        'ftransit18-IIVI_pnX', // Front Bumper Right
      ],
      minivan: [
        'tsienna20-YwrRNr9n', // Front Low
        'tsienna20-HykkFbXf', // Hood
        'tsienna20-TI4TVvT9', // Front Bumper Left
        'tsienna20-jY3cR5vy', // Front Full Left
        'tsienna20-65mfPdRD', // Front Lateral Low Left
        'tsienna20-is1tpnqR', // Front Roof Left
        'tsienna20-1LNxhgCR', // Lateral Low Left
        'tsienna20-4ihRwDkS', // Lateral Full Left
        'tsienna20-670P2H2V', // Rear Lateral Low Left
        'tsienna20-ZlRQXL-j', // Rear Full Left
        'tsienna20-1n_z8bYy', // Rear Left
        'tsienna20-qA3aAUUq', // Rear
        'tsienna20-OxFWgEPk', // Rear Roof
        'tsienna20-V2jVo2wV', // Rear Roof Right
        'tsienna20--a2RmRcs', // Rear Right
        'tsienna20-wlbzVAxz', // Rear Full Right
        'tsienna20-SebsoqJm', // Rear Lateral Low Right
        'tsienna20-uIHdpQ9y', // Lateral Full Right
        'tsienna20-Rw0Gtt7O', // Lateral Low Right
        'tsienna20-cI285Gon', // Front Lateral Low Right
        'tsienna20-MPCqHzeH', // Front Full Right
        'tsienna20-KHB_Cd9k', // Front Bumper Right
      ],
      pickup: [
        'ff150-zXbg0l3z', // Front Low
        'ff150-3he9UOwy', // Hood
        'ff150-KgHVkQBW', // Front Bumper Left
        'ff150-7UI3m9B3', // Front Full Left
        'ff150-FqbrFVr2', // Front Lateral Low Left
        'ff150-Ttsc7q6V', // Front Roof Left
        'ff150-vwE3yqdh', // Lateral Low Left
        'ff150-GOx2s_9L', // Lateral Full Left
        'ff150-ouGGtRnf', // Rear Lateral Low Left
        'ff150-phbX7Bef', // Rear Full Left
        'ff150--xPZZd83', // Rear Left
        'ff150-k4kh7Vra', // Rear
        'ff150-3dkU10af', // Rear Low
        'ff150-t3KBMPeD', // Rear Right
        'ff150-tT8sqplK', // Rear Full Right
        'ff150-3rM9XB0Z', // Rear Lateral Low Right
        'ff150-_UIadfVL', // Lateral Full Right
        'ff150-18YVVN-G', // Lateral Low Right
        'ff150-7nvlys8r', // Front Lateral Low Right
        'ff150-3lKZIoxw', // Front Full Right
        'ff150-gFp78fQO', // Front Bumper Right
      ],
    },
    taskName: 'damage_detection',
  },
  // {
  //   value: 'interior',
  //   title: 'inspection.interior.title',
  //   description: 'inspection.interior.description',
  //   icon: 'car-seat',
  //   sightIds: [
  //     'IqwSM3', // Front seats
  //     'rj5mhm', // Back seats
  //     'qhKA2z', // Trunk
  //     'rSvk2C', // Dashboard
  //   ],
  //   taskName: 'damage_detection',
  // },
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
    favicon: './assets/acv-favicon.png',
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
