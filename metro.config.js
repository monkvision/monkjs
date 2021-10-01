const path = require('path');

const reactNativePath = require.resolve('react-native');
const reactNativeFolder = `${
  reactNativePath.split('node_modules/react-native/')[0]
}node_modules/react-native/`;

const getConfig = async () => ({
  resetCache: Boolean(process.env.RESET_METRO_CACHE),
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, './packages')],
  transformerPath: require.resolve('metro/src/JSTransformer/worker.js'),
  resolver: {
    extraNodeModules: [
      '@monkvision/corejs',
      '@monkvision/react-native',
      '@monkvision/react-native-views',
    ],
    blacklistRE: new RegExp(
      `^((?!${reactNativeFolder.replace(
        '/',
        '\\/',
      )}).)*\\/node_modules\\/react-native\\/.*$`,
    ),
  },
});

module.exports = getConfig();
