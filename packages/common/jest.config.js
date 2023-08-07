module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.test.{ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
};
