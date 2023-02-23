const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
  ],
  plugins: ['jest', 'import', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'prettier/prettier': ERROR,
    'import/prefer-default-export': OFF,
    'import/extensions': OFF,
    'promise/always-return': OFF,
    'no-plusplus': [ERROR, { allowForLoopAfterthoughts: true }],
    'lines-between-class-members': OFF,
    'dot-notation': OFF,
  },
  overrides: [
    {
      files: ['test/**/*.{js,jsx}'],
      rules: {
        'import/first': OFF,
      },
    },
  ],
};
