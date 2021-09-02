module.exports = {
  source: 'src',
  output: 'lib',
  targets: [['commonjs', { copyFlow: true }]],
  main: 'lib/index.js',
  files: ['lib/', 'src/'],
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
};
