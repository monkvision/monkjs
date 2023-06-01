const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:jsx-a11y/recommended',
    '@monkvision/eslint-config-typescript',
    '@react-native-community',
  ],
  plugins: ['jsx-a11y', 'react', 'react-native', 'react-hooks'],
  parser: '@typescript-eslint/parser',
  rules: {
    'indent': ['error', 2],
    'no-console': ERROR,
    'react/function-component-definition': [ERROR, { namedComponent: 'arrow-function' }],
  },
  ignorePatterns: ['**/*.js', 'node_modules', 'dist'],
};
