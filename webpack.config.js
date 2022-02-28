const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

// Expo CLI will await this method so you can optionally return a promise.
// eslint-disable-next-line func-names
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias.react = path.resolve(__dirname, './node_modules/react');
  config.resolve.alias.assets = path.resolve(__dirname, './src/assets');
  config.resolve.alias.components = path.resolve(__dirname, './src/components');
  config.resolve.alias.config = path.resolve(__dirname, './src/config');
  config.resolve.alias.hooks = path.resolve(__dirname, './src/hooks');
  config.resolve.alias.screens = path.resolve(__dirname, './src/screens');
  config.resolve.alias.store = path.resolve(__dirname, './src/store');
  config.resolve.alias.Navigation = path.resolve(__dirname, './src/Navigation');

  config.resolve.alias['@monkvision/ui'] = path.resolve(__dirname, './packages/ui');
  config.resolve.alias['@monkvision/camera'] = path.resolve(__dirname, './packages/camera');
  config.resolve.alias['@monkvision/corejs'] = path.resolve(__dirname, './packages/corejs');
  config.resolve.alias['@monkvision/sights'] = path.resolve(__dirname, './packages/sights');
  config.resolve.alias['@monkvision/toolkit'] = path.resolve(__dirname, './packages/toolkit');
  config.resolve.alias['@monkvision/visualization'] = path.resolve(__dirname, './packages/visualization');

  if (config.mode === 'development') {
    config.devServer.compress = false;
  }

  if (config.mode === 'production') {
    config.optimization.minimize = true;
  }

  return config;
};
