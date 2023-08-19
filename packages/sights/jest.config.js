const { base } = require('@monkvision/jest-config');

module.exports = {
  ...base,
  coveragePathIgnorePatterns: [
    'src/lib/data.ts',
    'src/lib/index.ts',
  ],
};
