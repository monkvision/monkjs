---
id: install
title: "📦 Installation"
slug: /installation
---

## Available releases
| Language or framework | Module |
|-----------------------|--------|
| JavaScript | [@monkvision/corejs](#monkvisioncorejs) |
| React Native | [@monkvision/react-native](#monkvisionreact-native)<br/>[@monkvision/react-native-views](#monkvisionreact-native-views) |

We are working to provide as soon as possible new SDKs for other languages.

## JavaScript and React Native

Monk's SDK is made up of different modules which can be dense.
This is why we leave a lot of transparency in the use of the product
and we install the dependencies as peers rather than overloading the modules.

With the following **bulk command**,
you can directly use the SDK for the **JS & React Native stack**.

Install from `npm`
``` npm
npm install @monkvision/corejs @monkvision/react-native @monkvision/react-native-views @reduxjs/toolkit react-redux react-native-svg react-native-paper --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/corejs @monkvision/react-native @monkvision/react-native-views @reduxjs/toolkit react-redux react-native-svg react-native-paper
```

> Are you starting a new application? We recommend the use of Expo.
> Already have a React Native app? Some may be required
> to manage iOS, Android and Web compatibility as much as possible.

For questions or problems, see the [🧯 Troubleshooting](https://monkvision.github.io/monkjs/docs/troubleshooting) section
or post an issue on our [GitHub repo](https://github.com/monkvision/monkjs/issues).

### @monkvision/corejs
![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/corejs/package.json):
 ``` json
"@reduxjs/toolkit": "*"
"react": "^16.14.0 || ^17.0.0",
"react-redux": "^7.2.1"
 ```

### @monkvision/react-native
![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native/latest.svg)

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/react-native/package.json):
 ``` json
"react-native-svg": "*"
 ```

### @monkvision/react-native-views
![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native-views/latest.svg)

> Note: this module requires `react-native-paper` for basic use of Monk.
> For full customization of our components, please refer to `@monkvision/react-native`

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/react-native-views/package.json):
 ``` json
"@monkvision/corejs": "*",
"@monkvision/react-native": "*",
"react": "*",
"react-native": "*",
"react-native-paper": "*"
 ```

## What's next?

You can start following our guides on how to take photos and how to analyze them.
