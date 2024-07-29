const config = require('@monkvision/svgo-config');

module.exports = /** @type {import('svgo').Config} */ ({
  ...config,
  plugins: config.plugins?.filter((i) => i !== 'prefixIds'),
});
