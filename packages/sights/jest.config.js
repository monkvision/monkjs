module.exports = {
  rootDir: './',
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
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
