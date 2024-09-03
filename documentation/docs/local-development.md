---
sidebar_position: 9
---

# Local Development
The [packages section](category/packages) only references the MonkJs packages used as main dependencies of Node
apps, and necessary to develop a production app. But the MonkJs SDK contains a lot of other NPM packages that can be
used as dev dependencies when developing your Node apps. These include packages like preferred linting rules, custom
TypeScript configurations, testing utilities etc. Obviously, all of this is optional and just here to make your
developer life a bit simpler if your code practices align with ours. As a matter of fact, the entire MonkJs SDK is being
developed and maintained using these quality of life packages.

If you plan on installing one of these local development packages in your project, just make sure to install the exact
same version as the MonkJs version that you are currently using.

## Linting
The following packages export ESLint configurations that can extended, using the following syntax :

```javascript
module.exports = {
  extends: ['@monkvision/eslint-config-base'],
};
```

- [@monkvision/eslint-config-base](https://github.com/monkvision/monkjs/blob/main/configs/eslint-config-base/README.md) :
  Base ESLint configuration used for any JavaScript-based project.
- [@monkvision/eslint-config-typescript](https://github.com/monkvision/monkjs/blob/main/configs/eslint-config-typescript/README.md) :
  ESLint configuration used for TypeScript project.
- [@monkvision/eslint-config-typescript-react](https://github.com/monkvision/monkjs/blob/main/configs/eslint-config-typescript-react/README.md) :
  ESLint configuration used for React projects based on TypeScript.

## Project Configurations
The following packages export shared configurations used to configure local development dependencies :

- [@monkvision/jest-config](https://github.com/monkvision/monkjs/blob/main/configs/jest-config/README.md) :
  [Jest](https://jestjs.io/) configurations for unit testing.
- [@monkvision/prettier-config](https://github.com/monkvision/monkjs/blob/main/configs/prettier-config/README.md) :
  [Prettier](https://prettier.io/) configurations for code formatting.
- [@monkvision/svgo-config](https://github.com/monkvision/monkjs/blob/main/configs/svgo-config/README.md) :
  [SVGO](https://svgo.dev/) configurations for SVG linting.
- [@monkvision/typescript-config](https://github.com/monkvision/monkjs/blob/main/configs/typescript-config/README.md) :
  Ready-to-use TypeScript config files.

## Testing Utilities
The MonkJs SDK also includes a testing utility package called
[@monkvision/test-utils](https://github.com/monkvision/monkjs/blob/main/configs/test-utils]/README.md) that exports
useful functions and tools used for unit testing.

