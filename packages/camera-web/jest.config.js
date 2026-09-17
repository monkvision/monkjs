const { react } = require('@monkvision/jest-config');

module.exports = {
  ...react({ monorepo: true }),
  // The VehicleDetectionPOC folder is a proof of concept and ships without tests. Remove this entry when it is
  // promoted to a real feature: its utils are pure functions and are the cheapest thing in the package to cover.
  coveragePathIgnorePatterns: ['<rootDir>/src/VehicleDetectionPOC'],
};
