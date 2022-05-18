module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov'],
};
