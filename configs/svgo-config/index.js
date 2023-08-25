module.exports = {
  recursive: true,
  quiet: true,
  plugins: [
    'preset-default',
    'prefixIds',
    'removeDimensions',
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical',
      },
    },
  ],
};
