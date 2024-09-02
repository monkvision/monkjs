const { base } = require('@monkvision/jest-config');

module.exports = {
  ...base({ monorepo: true }),
  coveragePathIgnorePatterns: [
    'src/lib/*',
  ],
};
