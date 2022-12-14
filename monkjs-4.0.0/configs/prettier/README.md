# @monkvision/prettier-config
This package provides the base Prettier configuration for @monkvision Node.js packages.

# Install
To install the project simply run the following command :

```shell
yarn add prettier @monkvision/prettier-config
```

If you are installing this package as a dev dependency in the @monkvision yarn workspace, you can add the following line
in the dev dependencies of your package.json :

```
"@monkvision/prettier-config": "workspace:*"
```

# How to use
To use the Prettier config exported by this package, simply add the following line in your `package.json` :

```json
"prettier": "@monkvision/prettier-config"
```
