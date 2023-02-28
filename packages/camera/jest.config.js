module.exports = {

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    "node_modules",
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],

  // A preset that is used as a base for Jest's configuration
   //preset: 'react-native',
   preset: "@testing-library/react-native",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: ['@testing-library/jest-native','<rootDir>src/setUpTests.js'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "node_modules/expo-camera",
    "node_modules/expo-camera",
    "commonjs/",
    "module/",
  ],

  // A map from regular expressions to paths to transformers
   transform:{
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native)/).*/",
    "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic|expo(nent)?| @expo(nent)?/.*)",
    "node_modules/expo-camera",
    "node_modules/expo-font"
  ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,
};
