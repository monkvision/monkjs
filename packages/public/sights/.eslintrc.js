const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: ['@monkvision/eslint-config-typescript'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    'import/no-extraneous-dependencies': OFF,
    'no-console': OFF,
  },
  overrides: [
    {
      files: ['src/lib/*.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': OFF,
        'import/no-unresolved': OFF,
      },
    },
  ],
}
