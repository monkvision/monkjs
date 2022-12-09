module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.test.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov'],
};
