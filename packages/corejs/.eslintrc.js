module.exports = {
  root: false,
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:promise/recommended',
  ],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  plugins: ['jest'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: ['./tsconfig.eslint.json'],
  },
	settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    curly: ['error', 'all'],
    'consistent-this': ['error', 'self'],
    'linebreak-style': 'off', // Doesn't play nicely with Windows
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'prefer-destructuring': 'off', // Destructuring harm grep potential.
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': [0],
    'import/namespace': ['error', { allowComputed: true }],
    'object-curly-newline': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: false }],
    'max-len': ['warn', { code: 120 }],
    'import/prefer-default-export': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
  overrides: [
    {
      files: [
        'test/**/*.{ts,tsx}',
        // matching the pattern of the test runner
        '*.test.js',
        '*.int-test.js',
      ],
      env: {
        node: true,
        jest: true,
      },
      rules: {
        'import/first': 'off'
        // // does not work with wildcard imports. Mistakes will throw at runtime anyway
        // 'import/named': 0,
        // // for expect style assertions
        // 'no-unused-expressions': 'off',
        // 'import/extensions': 0,
      },
    },
    {
      files: ['**/*.md'],
      rules: {
        'no-console': 'off',
        'no-unused-expressions': 'off',
      },
    },
  ],
};
