---
sidebar_position: 3
title: Troubleshooting
hide_title: true
---

:::caution

This section refers to the old versions of the MonkJs SDK (version `3.X.X` and below). For the v4 docs, please refer to
[this page](docs/introduction.md).

:::

# 🧯 Troubleshooting
## `Failed to construct transformer`

``` sh
Failed to construct transformer: TypeError: Transformer is not a constructor at getTransformCacheKey
```

This is a _Metro_ failure.
1. Verify you have ``metro/src/JSTransformer/worker.js'`` file in your `node_modules`
2. Open ```metro.config.js```
3. Specify the `transformerPath`

``` javascript
/* metro.config.js */

const getConfig = async () => ({
  transformerPath: require.resolve('metro/src/JSTransformer/worker.js'),
});

module.exports = getConfig();
```
