const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ['@monkvision/eslint-config-typescript-react'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    'import/no-extraneous-dependencies': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    'no-console': OFF,
  }
}
