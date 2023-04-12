const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, './packages')];
config.resolver = {
  extraNodeModules: [
    '@monkvision/ui',
    '@monkvision/camera',
    '@monkvision/corejs',
    '@monkvision/sights',
    '@monkvision/toolkit',
    '@monkvision/visualization',
    '@monkvision/inspection-report',
  ],
};

module.exports = config;
