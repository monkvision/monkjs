const base = require('./base');

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.test.{ts,tsx}'],
  moduleNameMapper:{
    '\\.(css|less|sass|scss)$': '@monkvision/jest-config/__mocks__/style.mock',
    '\\.(gif|ttf|eot|svg)$': '@monkvision/jest-config/__mocks__/file.mock'
  },
};
