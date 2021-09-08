module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['plugin:import/recommended', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
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
  },
  overrides: [
    {
      files: [
        '**/test-utils/**/*.js',
        // matching the pattern of the test runner
        '*.test.js',
        '*.int-test.js',
      ],
      env: {
        browser: true,
        node: true,
        mocha: true,
      },
      rules: {
        // does not work with wildcard imports. Mistakes will throw at runtime anyway
        'import/named': 0,
        // for expect style assertions
        'no-unused-expressions': 'off',
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
