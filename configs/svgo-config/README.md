# @monkvision/svgo-config
This package provides the base SVGO configuration used throughout the MonkJs projects

# Install
To install the project simply run the following command :

```shell
yarn add -D svgo @monkvision/svgo-config
```

# How to use
To use the SVGO config exported by this package, simply add the following line in your `svgo.config.js` :

```javascript
const config = require('@monkvision/svgo-config');

module.exports = {
  ...config,
};
```
