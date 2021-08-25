module.exports = {
  source: 'src',
  output: 'lib',
  targets: [
    ['commonjs', { copyFlow: true }],
    'module',
  ],
  main: 'lib/commonjs/index.js',
  module: 'lib/module/index.js',
  'react-native': 'src/index.native.js',
  files: [
    'lib/',
    'src/',
  ],
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
};
