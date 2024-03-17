const { react } = require('@monkvision/jest-config');

module.exports = {
  ...react,
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
};
