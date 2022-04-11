module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['import', 'react-hooks'],
  rules: {
    curly: ['error', 'all'],
    'consistent-this': ['error', 'self'],
    'linebreak-style': 'off', // Doesn't play nicely with Windows
    'object-curly-newline': 'off',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'prefer-destructuring': 'off', // Destructuring harm grep potential.
    'react/no-danger': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/sort-prop-types': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/style-prop-object': 'off',
    'react/prop-types': [2, { ignore: ['children', 'className', 'style', 'theme', 'navigation'] }],
    'react/jsx-filename-extension': [1, {
      extensions: ['.native.js', '.ios.js', '.android.js', '.js'],
    }],
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': [0],
    'import/namespace': ['error', { allowComputed: true }],
  },
  overrides: [{
    files: [
      '**/test-utils/**/*.js',
      '*.test.js',
      '*.int-test.js',
    ],
    env: {
      browser: true,
      node: true,
      jest: true,
    },
    rules: {
      'import/named': 0,
      'no-unused-expressions': 'off',
    },
  }, {
    files: ['**/*.md'],
    rules: {
      'no-console': 'off',
      'no-unused-expressions': 'off',
    },
  }],
};
