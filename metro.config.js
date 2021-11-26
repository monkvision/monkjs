const path = require('path');

const getConfig = async () => ({
  resetCache: Boolean(process.env.RESET_METRO_CACHE),
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, './packages')],
  resolver: {
    extraNodeModules: [
      '@monkvision/corejs',
      '@monkvision/react-native',
      '@monkvision/react-native-views',
    ],
  },
});

module.exports = getConfig();
