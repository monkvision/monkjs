# @monkvision/jest-config
This package provides base Jest configuration files for @monkvision Node.js packages.

# Install
To install the project simply run the following command :

```shell
yarn add @monkvision/jest-config
```

Don't forget to install the required peer dependencies.

If you are installing this package as a dev dependency in the @monkvision yarn workspace, you can add the following line
in the dev dependencies of your package.json :

```
"@monkvision/jest-config": "workspace:*"
```

# How to use
To use one of the Jest config exported by this package, place the following code in your `jest.config.js` :

```javascript
const monkJest = require('@monkvision/jest-config');

module.exports = {
  ...monkJest.base,
  rootDir: './',
}
```

You can replace `.base` by the name of the config you want to use.

# Available configs
Here is a list of available Jest configs exported by this project :

| Name   | Usage                                         |
|--------|-----------------------------------------------|
| `base` | Base configuration for any typescript project |
