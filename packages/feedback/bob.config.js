module.exports = {
  source: 'src',
  output: '.',
  targets: [
    ['commonjs', { copyFlow: true }],
    ['module', { copyFlow: true }],
  ],
};
