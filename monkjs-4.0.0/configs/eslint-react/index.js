const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    'react-app',
    'react-app/jest',
    'airbnb',
    'airbnb/hooks',
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'jest', 'import', 'prettier'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'prettier/prettier': ERROR,
    'import/prefer-default-export': OFF,
    'import/extensions': OFF,
    'promise/always-return': OFF,
    '@typescript-eslint/lines-between-class-members': OFF,
    'no-plusplus' : [
      ERROR,
      { allowForLoopAfterthoughts: true },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': [ERROR],
        'no-shadow': OFF,
        'no-undef': OFF,
      },
    },
    {
      files: ['test/**/*.{ts,tsx}'],
      rules: {
        'import/first': OFF,
      },
    },
  ],
}
