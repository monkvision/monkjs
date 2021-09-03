module.exports = {
  source: 'src',
  output: 'react-native-monk',
  targets: [['commonjs'], ['module', { copyFlow: true }]],
  main: 'react-native-monk/commonjs/index.js',
  module: 'react-native-monk/module/index.js',
  files: ['react-native-monk/'],
  modulePathIgnorePatterns: ['<rootDir>/react-native-monk/'],
};
