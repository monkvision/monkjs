const { base } = require('@monkvision/jest-config');

module.exports = {
  ...base,
  coveragePathIgnorePatterns: [
    'src/lib/*',
  ],
};
