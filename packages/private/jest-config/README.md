# @monkvision/jest-config
This package provides the base Jest configuration used throughout the MonkJs projects

# Install
To install the project simply run the following command :

```shell
yarn add -D jest @monkvision/jest-config
```

# How to use
To use the Jest config exported by this package, simply add the following line in your `jest.config.js` :

```javascript
const { CONFIG } = require('@monkvision/jest-config');

module.exports = {
...CONFIG,
};

```

And replace the `CONFIG` keyword with one of the following Jest configuration available in the package :


| Config Name | Usage                                             |
|-------------|---------------------------------------------------|
| `base`      | Base configuration for any Node.Js project .      |
| `react`     | Base configuration used for React-based projects. |
