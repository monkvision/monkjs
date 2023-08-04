const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    '@monkvision/eslint-config-typescript',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  parser: '@typescript-eslint/parser',
  rules: {
    'indent': ['error', 2],
    'no-console': ERROR,
    'react/function-component-definition': [ERROR, { namedComponent: 'arrow-function' }],
  },
  ignorePatterns: ['**/*.js', 'node_modules', 'dist'],
};
