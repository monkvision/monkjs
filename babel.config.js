function babelConfig(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
      ['module-resolver', { root: ['./src'] }],
      'react-native-reanimated/plugin',
    ],
  };
}

module.exports = babelConfig;
