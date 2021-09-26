module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['plugin:import/recommended', 'airbnb'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },

  plugins: ['jest', 'react-hooks'],

  rules: {
    curly: ['error', 'all'],
    'consistent-this': ['error', 'self'],
    'linebreak-style': 'off', // Doesn't play nicely with Windows
    'object-curly-newline': 'off',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'prefer-destructuring': 'off', // Destructuring harm grep potential.
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off', // deprecated
    'react/jsx-handler-names': ['error', {
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'on',
    }],

    'react/no-danger': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/sort-prop-types': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/style-prop-object': 'off',
    'react/prop-types': [2, { ignore: ['children', 'className'] }],
    'react/jsx-filename-extension': [1, {
      extensions: ['.native.js', '.ios.js', '.android.js', '.jsx'],
    }],

    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': [0],
    'import/namespace': ['error', { allowComputed: true }],
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
        jest: true,
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
