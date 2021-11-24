---
id: install
title: "📦 Installation"
slug: /installation
---

## Available releases
| Language or framework | Module |
|-----------------------|--------|
| JavaScript | [@monkvision/corejs](https://www.npmjs.com/package/@monkvision/corejs) |
| React Native | [@monkvision/react-native](https://www.npmjs.com/package/@monkvision/react-native) <br/>[@monkvision/react-native-views](https://www.npmjs.com/package/@monkvision/react-native-views) |

We are working to provide as soon as possible new SDKs for other languages.

## JavaScript and React Native

Monk's SDK is made up of different modules which can be dense.
This is why we leave a lot of transparency in the use of the product
and we install the dependencies as peers rather than overloading the modules.

With the following **bulk command**,
you can directly use the SDK for the **JS & React Native stack**.

Install from `npm`
``` npm
npm install @monkvision/corejs @monkvision/react-native @monkvision/react-native-views @reduxjs/toolkit react-native-web --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/corejs @monkvision/react-native @monkvision/react-native-views @reduxjs/toolkit react-native-web
```

The command install all dependencies you need if you go all in. We mean that you probably don't need _react-native-web_ if you don't run your App in the browser.

> Are you starting a new application? We recommend the use of Expo.
> Already have a React Native app? Some may be required
> to manage iOS, Android and Web compatibility as much as possible.

For questions or problems, see the [🧯 Troubleshooting](https://monkvision.github.io/monkjs/docs/troubleshooting) section
or post an issue on our [GitHub repo](https://github.com/monkvision/monkjs/issues).

## What's next?

You can start following our guides on first, setting up depending on the workflow you use, then taking pictures.
