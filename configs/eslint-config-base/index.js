const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
  ],
  plugins: ["import", "prettier", "jest"],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  rules: {
    "prettier/prettier": ERROR,
    "import/prefer-default-export": OFF,
    "import/extensions": OFF,
    "promise/always-return": OFF,
    "no-plusplus": [ERROR, { allowForLoopAfterthoughts: true }],
    "lines-between-class-members": OFF,
    "dot-notation": OFF,
    indent: OFF,
    curly: [ERROR, "all"],
    "max-len": [
      ERROR,
      {
        code: 120,
        comments: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    "capitalized-comments": [ERROR],
    "promise/catch-or-return": [ERROR, { allowFinally: true }],
    "import/no-unresolved": [ERROR, { caseSensitive: false }],
    "jest/no-mocks-import": OFF,
    "jest/expect-expect": OFF,
  },
  overrides: [
    {
      files: ["test/**/*.{js,jsx}"],
      rules: {
        "import/first": OFF,
        "import/order": OFF,
        "@typescript-eslint/no-empty-function": OFF,
        "class-methods-use-this": OFF,
      },
    },
  ],
};
