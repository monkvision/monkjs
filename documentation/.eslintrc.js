const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ['@monkvision/eslint-config-typescript-react'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    '@typescript-eslint/no-var-requires': OFF,
    'global-require': OFF,
    'import/no-unresolved': OFF,
    'react/function-component-definition': OFF,
    'no-console': OFF,
  },
}
