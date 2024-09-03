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

# External Developments
If you are using MonkJs packages in an app outside the MonkJs monorepository, you might want to use our predefined
tests setup file to avoid ECMAScript Modules conflicts and to set up automocks for @monkvision packages :

```js
const { base } = require('@monkvision/jest-config');

module.exports = {
  ...base(),
  setupFilesAfterEnv: ['<rootDir>/node_modules/@monkvision/jest-config/setupTests.js']
};
```

This will prevent errors like this to show up when running your tests :

```
Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /Users/souyahia/Projects/Monk/monkjs_private/apps/drive/node_modules/ky/distribution/index.js:2
    import { Ky } from './core/Ky.js';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module
```
