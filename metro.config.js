const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig.compress.drop_console = true;
config.projectRoot = __dirname;
config.watchFolders = [path.resolve(__dirname, './packages')];
config.resolver = {
  extraNodeModules: [
    '@monkvision/corejs',
    '@monkvision/react-native',
    '@monkvision/react-native-views',
  ],
};

module.exports = config;
