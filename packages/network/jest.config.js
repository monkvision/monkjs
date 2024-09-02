const { react } = require('@monkvision/jest-config');

module.exports = {
  ...react({ monorepo: true }),
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
};
