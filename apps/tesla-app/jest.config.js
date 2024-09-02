const { react } = require('@monkvision/jest-config');

module.exports = {
  ...react,
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
