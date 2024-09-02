const esModules = ['@monkvision/test-utils', 'ky'].join('|');

module.exports = (options) => ({
  rootDir: './',
  roots: options.monorepo ? ['<rootDir>', '<rootDir>/../../configs/test-utils/src/__mocks__'] : ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  transformIgnorePatterns: options?.monorepo ? [] : [`node_modules/(?!${esModules})`],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
})
