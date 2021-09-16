const path = require('path');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, './packages')],
  resolver: {
    extraNodeModules: ['@monk/corejs', '@monk/react-native'],
  },
  transformerPath: require.resolve('metro/src/JSTransformer/worker.js'),
};
