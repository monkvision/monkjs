const { react } = require('@monkvision/jest-config');

module.exports = {
  ...react({ monorepo: true }),
  // ocr.worker.ts runs in a browser Web Worker context and cannot be executed in jsdom
  collectCoverageFrom: ['src/**/*.ts', '!src/ocr.worker.ts'],
};
