const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    '@monkvision/eslint-config-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint'],
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
    '@typescript-eslint/lines-between-class-members': OFF,
    'no-useless-constructor': OFF,
    '@typescript-eslint/no-empty-function': [ERROR, { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-empty-interface': OFF,
    '@typescript-eslint/no-non-null-assertion': OFF,
    '@typescript-eslint/no-unused-vars': [
      ERROR,
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    'no-underscore-dangle': OFF,
    '@typescript-eslint/naming-convention': [
      ERROR,
      { selector: 'interface', format: ['PascalCase'] },
      { selector: 'enum', format: ['PascalCase'] },
      { selector: 'typeAlias', format: ['PascalCase'] },
    ],
  },
  overrides: [
    {
      files: ['*.{ts,tsx}'],
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
        'import/order': OFF,
        '@typescript-eslint/no-empty-function': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        'class-methods-use-this': OFF,
      },
    },
  ],
};
