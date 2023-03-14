module.exports = {

  collectCoverage: true,

  coverageDirectory: 'coverage',

  moduleDirectories: [
    'node_modules',
  ],

  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],

  preset: '@testing-library/react-native',

  setupFilesAfterEnv: ['<rootDir>/src/setUpTests.js'],

  testEnvironment: 'jsdom',

  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  testPathIgnorePatterns: [
    'node_modules/',
    'commonjs/',
    'module/',
  ],

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native)/).*/',
    'node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic|expo(nent)?| @expo(nent)?/.*)',
  ],
};
