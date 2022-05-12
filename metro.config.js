const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  getTransformOptions: () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

config.transformer.minifierConfig.compress.drop_console = true;
config.projectRoot = __dirname;
config.watchFolders = [path.resolve(__dirname, './packages')];
config.resolver = {
  extraNodeModules: [
    '@monkvision/ui',
    '@monkvision/camera',
    '@monkvision/corejs',
    '@monkvision/sights',
    '@monkvision/toolkit',
    '@monkvision/visualization',
  ],
};

config.resolver.sourceExts = process.env.RN_SRC_EXT
  ? [...process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts), 'mjs']
  : [...defaultSourceExts, 'mjs'];

module.exports = config;
