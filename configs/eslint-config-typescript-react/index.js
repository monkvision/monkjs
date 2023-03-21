const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    '@monkvision/eslint-config-typescript',
  ],
  plugins: ['jest', '@typescript-eslint', 'import', 'prettier'],
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
    'no-console': ERROR,
    'react/function-component-definition': [ERROR, { namedComponent: 'arrow-function' }],
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
  ignorePatterns: ['**/*.js', 'node_modules', 'dist'],
};
