const base = require('./base');

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.test.{ts,tsx}'],
  moduleNameMapper:{
    '\\.(css|less|sass|scss)$': '@monkvision/test-utils/src/__mocks__/imports/style',
    '\\.(gif|ttf|eot|svg)$': '@monkvision/test-utils/src/__mocks__/imports/file'
  },
};
