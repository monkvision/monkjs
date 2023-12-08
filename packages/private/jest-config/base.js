module.exports = {
  rootDir: './',
  roots: ['<rootDir>', '<rootDir>/../../private/test-utils/src/__mocks__'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};
