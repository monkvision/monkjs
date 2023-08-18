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
    'no-console': ERROR,
    'react/function-component-definition': [ERROR, { namedComponent: 'arrow-function' }],
    'jsx-a11y/media-has-caption': OFF,
  },
  ignorePatterns: ['**/*.js', 'node_modules', 'dist'],
  overrides: [
    {
      files: ['test/**/*.{ts,tsx}'],
      rules: {
        'import/first': OFF,
      },
    },
  ],
};
