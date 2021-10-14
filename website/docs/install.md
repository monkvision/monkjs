---
id: install
title: "📦 Installation"
slug: /installation
---

## Available pre-releases
| Language or framework | Module |
|-----------------------|--------|
| JavaScript | [@monkvision/corejs](#monkvisioncorejs) |
| React Native | [@monkvision/react-native](#monkvisionreact-native)<br/>[@monkvision/react-native-views](#monkvisionreact-native-views) |

We are working to provide as soon as possible new SDKs for _Dart_, _Flutter_ or _Python_.

## JavaScript and React Native

Monk's SDK is made up of different modules which can be dense.
This is why we leave a lot of transparency in the use of the product
and we install the dependencies as peers rather than overloading the modules.

With the following **bulk command**,
you can directly use the SDK for the **JS & React Native stack**.

Install from `npm`
``` npm
npm install @monkvision/corejs @monkvision/react-native @monkvision/react-native-views @reduxjs/toolkit react-redux metro-config babel-preset-expo metro-react-native-babel-preset prop-types react-native-svg react-native-paper --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/corejs @monkvision/react-native @monkvision/react-native-views @reduxjs/toolkit react-redux metro-config babel-preset-expo metro-react-native-babel-preset prop-types react-native-svg react-native-paper
```

> Are you starting a new application? We recommend the use of Expo.
> Already have a React Native app? Some plugins will be required for you
> to manage iOS Android and Web compatibility as much as possible.

For questions or problems, see the [🧯 Troubleshooting](https://monkvision.github.io/monkjs/docs/troubleshooting) section
or post an issue on our [GitHub repo](https://github.com/monkvision/monkjs/issues).

## @monkvision/corejs
![npm next package](https://img.shields.io/npm/v/@monkvision/corejs/next.svg)

Install from `npm`
``` npm
npm install @monkvision/corejs @reduxjs/toolkit react-redux --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/corejs @reduxjs/toolkit react-redux
```

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/corejs/package.json):
 ``` json
"@reduxjs/toolkit": "*"
"react": "^16.14.0 || ^17.0.0",
"react-redux": "^7.2.1"
 ```
---

## @monkvision/react-native
![npm next package](https://img.shields.io/npm/v/@monkvision/react-native/next.svg)

Install from `npm`
``` npm
npm install @monkvision/react-native babel-preset-expo metro-react-native-babel-preset prop-types react-native-svg --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native babel-preset-expo metro-react-native-babel-preset prop-types react-native-svg
```

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/react-native/package.json):
 ``` json
"prop-types": "*",
"babel-preset-expo": "^8.4.1",
"metro-react-native-babel-preset": "^0.66.2",
"react-native-svg": "*"
 ```

---

## @monkvision/react-native-views
![npm next package](https://img.shields.io/npm/v/@monkvision/react-native-views/next.svg)

Install from `npm`
``` npm
npm install @monkvision/react-native-views @monkvision/corejs @monkvision/react-native metro-config react-native-paper --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native-views @monkvision/corejs @monkvision/react-native metro-config react-native-paper
```

> Note: this module requires `react-native-paper` for basic use of Monk.
> For full customization of our components, please refer to `@monkvision/react-native`

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/react-native-views/package.json):
 ``` json
"@monkvision/corejs": "*",
"@monkvision/react-native": "*",
"babel-preset-expo": "^8.4.1",
"metro-react-native-babel-preset": "^0.66.2",
"metro-config": "^0.66.2",
"prop-types": "*",
"react": "*",
"react-native": "*",
"react-native-paper": "*"
 ```

## What's next?

You can start following our guides on how to take photos and how to analyze them.
