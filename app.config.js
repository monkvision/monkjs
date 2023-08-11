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
    value: 'car360',
    title: 'inspection.damageDetection.title',
    description: 'inspection.damageDetection.description',
    icon: 'axis-z-rotate-counterclockwise',
    sightIds: {
      suv: [
        'jgc21-QIvfeg0X', // Front Low
        'jgc21-KyUUVU2P', // Hood
        'jgc21-zCrDwYWE', // Front Bumper Side Left
        'jgc21-z15ZdJL6', // Front Wheel Left
        'jgc21-RE3li6rE', // Front Lateral Left
        'jgc21-omlus7Ui', // Lateral Low Left
        'jgc21-m2dDoMup', // Rear Lateral Left
        'jgc21-3gjMwvQG', // Rear Wheel Left
        'jgc21-ezXzTRkj', // Rear Bumper Side Left
        'jgc21-tbF2Ax8v', // Rear
        'jgc21-3JJvM7_B', // Rear Bumper Side Right
        'jgc21-RAVpqaE4', // Rear Wheel Right
        'jgc21-F-PPd4qN', // Rear Lateral Right
        'jgc21-XXh8GWm8', // Lateral Low Right
        'jgc21-TRN9Des4', // Front Lateral Low Right
        'jgc21-s7WDTRmE', // Front Wheel Right
        'jgc21-__JKllz9', // Front Bumper Side Right
      ],
      cuv: [
        'fesc20-H1dfdfvH', // Front Low
        'fesc20-WMUaKDp1', // Hood
        'fesc20-LTe3X2bg', // Front Bumper Side Left
        'fesc20-WIQsf_gX', // Front Wheel Left
        'fesc20-hp3Tk53x', // Front Lateral Left
        'fesc20-fOt832UV', // Lateral Low Left
        'fesc20-NLdqASzl', // Rear Lateral Left
        'fesc20-4Wqx52oU', // Rear Wheel Left
        'fesc20-dfICsfSV', // Rear Bumper Side Left
        'fesc20-X8k7UFGf', // Rear
        'fesc20-LZc7p2kK', // Rear Bumper Side Right
        'fesc20-5Ts1UkPT', // Rear Wheel Right
        'fesc20-gg1Xyrpu', // Rear Lateral Right
        'fesc20-P0oSEh8p', // Lateral Low Right
        'fesc20-j3H8Z415', // Front Lateral Low Right
        'fesc20-dKVLig1i', // Front Wheel Right
        'fesc20-Wzdtgqqz', // Front Bumper Side Right
      ],
      sedan: [
        'haccord-8YjMcu0D', // Front Low
        'haccord-DUPnw5jj', // Hood
        'haccord-hsCc_Nct', // Front Bumper Side Left
        'haccord-GQcZz48C', // Front Wheel Left
        'haccord-QKfhXU7o', // Front Lateral Left
        'haccord-mdZ7optI', // Lateral Low Left
        'haccord-bSAv3Hrj', // Rear Lateral Left
        'haccord-W-Bn3bU1', // Rear Wheel Left
        'haccord-GdWvsqrm', // Rear Bumper Side Left
        'haccord-ps7cWy6K', // Rear
        'haccord-Jq65fyD4', // Rear Bumper Side Right
        'haccord-OXYy5gET', // Rear Wheel Right
        'haccord-5LlCuIfL', // Rear Lateral Right
        'haccord-Gtt0JNQl', // Lateral Low Right
        'haccord-cXSAj2ez', // Front Lateral Low Right
        'haccord-KN23XXkX', // Front Wheel Right
        'haccord-Z84erkMb', // Front Bumper Side Right
      ],
      hatchback: [
        'ffocus18-XlfgjQb9', // Front Low
        'ffocus18-3TiCVAaN', // Hood
        'ffocus18-43ljK5xC', // Front Bumper Side Left
        'ffocus18-x_1SE7X-', // Front Wheel Left
        'ffocus18-QKfhXU7o', // Front Lateral Left
        'ffocus18-yo9eBDW6', // Lateral Low Left
        'ffocus18-cPUyM28L', // Rear Lateral Left
        'ffocus18-S3kgFOBb', // Rear Wheel Left
        'ffocus18-9MeSIqp7', // Rear Bumper Side Left
        'ffocus18-X2LDjCvr', // Rear
        'ffocus18-jWOq2CNN', // Rear Bumper Side Right
        'ffocus18-P2jFq1Ea', // Rear Wheel Right
        'ffocus18-U3Bcfc2Q', // Rear Lateral Right
        'ffocus18-ts3buSD1', // Lateral Low Right
        'ffocus18-cXSAj2ez', // Front Lateral Low Right
        'ffocus18-KkeGvT-F', // Front Wheel Right
        'ffocus18-lRDlWiwR', // Front Bumper Side Right
      ],
      van: [
        'ftransit18-wyXf7MTv', // Front Low
        'ftransit18-UNAZWJ-r', // Hood
        'ftransit18-5SiNC94w', // Front Bumper Side Left
        'ftransit18-Y0vPhBVF', // Front Wheel Left
        'ftransit18-xyp1rU0h', // Front Lateral Left
        'ftransit18-6khKhof0', // Lateral Low Left
        'ftransit18-eXJDDYmE', // Rear Lateral Left
        'ftransit18-3Sbfx_KZ', // Rear Wheel Left
        'ftransit18-iu1Vj2Oa', // Rear Bumper Side Left
        'ftransit18-aA2K898S', // Rear Up Left
        'ftransit18-NwBMLo3Z', // Rear
        'ftransit18-cf0e-pcB', // Rear Up Right
        'ftransit18-FFP5b34o', // Rear Bumper Side Right
        'ftransit18-RJ2D7DNz', // Rear Wheel Right
        'ftransit18-3fnjrISV', // Rear Lateral Right
        'ftransit18-eztNpSRX', // Lateral Low Right
        'ftransit18-TkXihCj4', // Front Lateral Low Right
        'ftransit18-4NMPqEV6', // Front Wheel Right
        'ftransit18-IIVI_pnX', // Front Bumper Side Right
      ],
      minivan: [
        'tsienna20-YwrRNr9n', // Front Low
        'tsienna20-HykkFbXf', // Hood
        'tsienna20-TI4TVvT9', // Front Bumper Side Left
        'tsienna20-65mfPdRD', // Front Wheel Left
        'tsienna20-Ia0SGJ6z', // Front Lateral Left
        'tsienna20-1LNxhgCR', // Lateral Low Left
        'tsienna20-U_FqYq-a', // Rear Lateral Left
        'tsienna20-670P2H2V', // Rear Wheel Left
        'tsienna20-1n_z8bYy', // Rear Bumper Side Left
        'tsienna20-qA3aAUUq', // Rear
        'tsienna20--a2RmRcs', // Rear Bumper Side Right
        'tsienna20-SebsoqJm', // Rear Wheel Right
        'tsienna20-u57qDaN_', // Rear Lateral Right
        'tsienna20-Rw0Gtt7O', // Lateral Low Right
        'tsienna20-TibS83Qr', // Front Lateral Low Right
        'tsienna20-cI285Gon', // Front Wheel Right
        'tsienna20-KHB_Cd9k', // Front Bumper Side Right
      ],
      pickup: [
        'ff150-zXbg0l3z', // Front Low
        'ff150-3he9UOwy', // Hood
        'ff150-KgHVkQBW', // Front Bumper Side Left
        'ff150-FqbrFVr2', // Front Wheel Left
        'ff150-g_xBOOS2', // Front Lateral Left
        'ff150-vwE3yqdh', // Lateral Low Left
        'ff150-V-xzfWsx', // Rear Lateral Left
        'ff150-ouGGtRnf', // Rear Wheel Left
        'ff150--xPZZd83', // Rear Bumper Side Left
        'ff150-nF_oFvhI', // Rear
        'ff150-t3KBMPeD', // Rear Bumper Side Right
        'ff150-3rM9XB0Z', // Rear Wheel Right
        'ff150-eOjyMInj', // Rear Lateral Right
        'ff150-18YVVN-G', // Lateral Low Right
        'ff150-BmXfb-qD', // Front Lateral Low Right
        'ff150-gFp78fQO', // Front Wheel Right
        'ff150-7nvlys8r', // Front Bumper Side Right
      ],
    },
    taskName: 'damage_detection',
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
          url: 'https://monkai.sentry.io',
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
