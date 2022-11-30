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
        'jgc21-VHq_6BM-', // Front Full Left
        'jgc21-RE3li6rE', // Front Lateral Left (updated)
        'jgc21-imomJ2V0', // Front Roof Left
        'jgc21-omlus7Ui', // Lateral Low Left
        'jgc21-TEoi50Ff', // Lateral Full Left
        'jgc21-m2dDoMup', // Rear Lateral Left (updated)
        'jgc21-Emzc8jJA', // Rear Full Left
        'jgc21-tbF2Ax8v', // Rear
        'jgc21-ZubJ48-U', // Rear Roof
        'jgc21-2_5eHL-F', // Rear Full Right
        'jgc21-F-PPd4qN', // Rear Lateral Right (updated)
        'jgc21-1j-oTPag', // Lateral Full Right
        'jgc21-XXh8GWm8', // Lateral Low Right
        'jgc21-TRN9Des4', // Front Lateral Right (updated)
        'jgc21-zkvFMHnS', // Front Full Right
      ],
      cuv: [
        'fesc20-H1dfdfvH', // Front Low
        'fesc20-WMUaKDp1', // Hood
        'fesc20-bD8CBhYZ', // Front Full Left
        'fesc20-hp3Tk53x', // Front Lateral Left (updated)
        'fesc20-6GPUkfYn', // Front Roof Left
        'fesc20-fOt832UV', // Lateral Low Left
        'fesc20-26n47kaO', // Lateral Full Left
        'fesc20-NLdqASzl', // Rear Lateral Left (updated)
        'fesc20-T4dIGLgy', // Rear Full Left
        'fesc20-X8k7UFGf', // Rear (updated ?)
        'fesc20-2bLRuhEQ', // Rear Roof
        'fesc20-EJ0tXYBW', // Rear Full Right
        'fesc20-gg1Xyrpu', // Rear Lateral Right (updated)
        'fesc20-HYz5ziHi', // Lateral Full Right
        'fesc20-P0oSEh8p', // Lateral Low Right
        'fesc20-j3H8Z415', // Front Lateral Right (updated)
        'fesc20-0mJeXBDf', // Front Full Right
      ],
      sedan: [
        'haccord-8YjMcu0D', // Front Low
        'haccord-DUPnw5jj', // Hood
        'haccord-huAZfQJA', // Front Full Left
        'haccord-QKfhXU7o', // Front Lateral Left (updated)
        'haccord-oiY_yPTR', // Front Roof Left
        'haccord-mdZ7optI', // Lateral Low Left
        'haccord-_YnTubBA', // Lateral Full Left
        'haccord-bSAv3Hrj', // Rear Lateral Left (updated)
        'haccord-k6MiX2MR', // Rear Full Left
        'haccord-ps7cWy6K', // Rear (updated ?)
        'haccord-pplCo6sV', // Rear Roof
        'haccord-zNA0vVT0', // Rear Full Right
        'haccord-5LlCuIfL', // Rear Lateral Right (updated)
        'haccord-PGr3RzzP', // Lateral Full Right
        'haccord-Gtt0JNQl', // Lateral Low Right
        'haccord-cXSAj2ez', // Front Lateral Right (updated)
        'haccord-KvP-pm8L', // Front Full Right
      ],
      hatchback: [
        'ffocus18-XlfgjQb9', // Front Low
        'ffocus18-3TiCVAaN', // Hood
        'ffocus18-GgOSpLl6', // Front Full Left
        'ffocus18-QKfhXU7o', // Front Lateral Left (updated)
        'ffocus18-ZXKOomlv', // Front Roof Left
        'ffocus18-yo9eBDW6', // Lateral Low Left
        'ffocus18-6FX31ty1', // Lateral Full Left
        'ffocus18-cPUyM28L', // Rear Lateral Left (updated)
        'ffocus18-IoqRrmlA', // Rear Full Left
        'ffocus18-X2LDjCvr', // Rear (updated ?)
        'ffocus18-p6mBZGcW', // Rear Roof
        'ffocus18-8WjvbtMD', // Rear Full Right
        'ffocus18-U3Bcfc2Q', // Rear Lateral Right (updated)
        'ffocus18-FdsQDaTW', // Lateral Full Right
        'ffocus18-ts3buSD1', // Lateral Low Right
        'ffocus18-cXSAj2ez', // Front Lateral Right (updated)
        'ffocus18-seOy3jwd', // Front Full Right
      ],
      van: [
        'ftransit18-wyXf7MTv', // Front Low
        'ftransit18-UNAZWJ-r', // Hood
        'ftransit18-ffghVsNz', // Front Full Left
        'ftransit18-xyp1rU0h', // Front Lateral Left (updated)
        'ftransit18-6khKhof0', // Lateral Low Left
        'ftransit18-rsXWUN8X', // Lateral Full Left
        'ftransit18-eXJDDYmE', // Rear Lateral Left (updated)
        'ftransit18-y_wTc7ED', // Rear Full Left
        'ftransit18-NwBMLo3Z', // Rear
        'ftransit18-cf0e-pcB', // Rear Up Right
        'ftransit18-f2W6pHaR', // Rear Full Right
        'ftransit18-3fnjrISV', // Rear Lateral Right (updated)
        'ftransit18-G24AdP6r', // Lateral Full Right
        'ftransit18-eztNpSRX', // Lateral Low Right
        'ftransit18-TkXihCj4', // Front Lateral Right (updated)
        'ftransit18--w_ir_yH', // Front Full Right
      ],
      minivan: [
        'tsienna20-YwrRNr9n', // Front Low
        'tsienna20-HykkFbXf', // Hood
        'tsienna20-jY3cR5vy', // Front Full Left
        'tsienna20-Ia0SGJ6z', // Front Lateral Left (updated)
        'tsienna20-is1tpnqR', // Front Roof Left
        'tsienna20-1LNxhgCR', // Lateral Low Left
        'tsienna20-4ihRwDkS', // Lateral Full Left
        'tsienna20-U_FqYq-a', // Rear Lateral Left (updated)
        'tsienna20-ZlRQXL-j', // Rear Full Left
        'tsienna20-qA3aAUUq', // Rear
        'tsienna20-OxFWgEPk', // Rear Roof
        'tsienna20-wlbzVAxz', // Rear Full Right
        'tsienna20-u57qDaN_', // Rear Lateral Right (updated)
        'tsienna20-uIHdpQ9y', // Lateral Full Right
        'tsienna20-Rw0Gtt7O', // Lateral Low Right
        'tsienna20-TibS83Qr', // Front Lateral Right (updated)
        'tsienna20-MPCqHzeH', // Front Full Right
      ],
      pickup: [
        'ff150-zXbg0l3z', // Front Low
        'ff150-3he9UOwy', // Hood
        'ff150-7UI3m9B3', // Front Full Left
        'ff150-g_xBOOS2', // Front Lateral Left (updated)
        'ff150-Ttsc7q6V', // Front Roof Left
        'ff150-vwE3yqdh', // Lateral Low Left
        'ff150-GOx2s_9L', // Lateral Full Left
        'ff150-V-xzfWsx', // Rear Lateral Left (updated)
        'ff150-phbX7Bef', // Rear Full Left
        'ff150-nF_oFvhI', // Rear (updated ?)
        'ff150-tT8sqplK', // Rear Full Right
        'ff150-eOjyMInj', // Rear Lateral Right (updated)
        'ff150-_UIadfVL', // Lateral Full Right
        'ff150-18YVVN-G', // Lateral Low Right
        'ff150-BmXfb-qD', // Front Lateral Right (updated)
        'ff150-3lKZIoxw', // Front Full Right
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
    ...eas.build.preview.env,
  },
};
