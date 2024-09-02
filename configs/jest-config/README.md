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
const { base } = require('@monkvision/jest-config');

module.exports = {
  ...base(),
};

```

And replace the `base` keyword with one of the following Jest configuration available in the package :


| Config Name | Usage                                             |
|-------------|---------------------------------------------------|
| `base`      | Base configuration for any Node.Js project .      |
| `react`     | Base configuration used for React-based projects. |

# Tests Setup
If you are using the [@monkvision/test-utils](https://github.com/monkvision/monkjs/tree/main/configs/test-utils)
package, and you wish to enjoy Jest automocking with the provided mocks, you can use the following test set up file :

```js
const { base } = require('@monkvision/jest-config');

module.exports = {
  ...base(),
  setupFilesAfterEnv: ['<rootDir>/node_modules/@monkvision/jest-config/setupTests.js']
};
```
