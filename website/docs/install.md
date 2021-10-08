---
id: install
title: Installation
slug: /installation
---

## Available pre-releases
| Language or framework | Module |
|-----------------------|--------|
| JavaScript 🚧 | [@monkvision/corejs](#monkvisioncorejs) |
| React Native 🚧 | [@monkvision/react-native](#monkvisionreact-native)<br/>[@monkvision/react-native-views](#monkvisionreact-native-views) |

We are working to provide as soon as possible new SDKs for _Dart_, _Flutter_ or _Python_.

## @monkvision/corejs
![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

Install with `npm`
``` npm
npm install @monkvision/corejs @reduxjs/toolkit --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/corejs @reduxjs/toolkit
```

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/master/packages/corejs/package.json):
 ``` json
"@reduxjs/toolkit": "*"
 ```
---

## @monkvision/react-native
![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native/latest.svg)

Install with `npm`
``` npm
npm install @monkvision/react-native prop-types react react-native react-native-svg --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native prop-types react react-native react-native-svg
```

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/master/packages/react-native/package.json):
 ``` json
"prop-types": "*",
"react": "*",
"react-native": "*",
"react-native-svg": "*"
 ```

---

## @monkvision/react-native-views
![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native-views/latest.svg)

Install with `npm`
``` npm
npm install @monkvision/react-native-views @monkvision/corejs @monkvision/react-native --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native-views @monkvision/corejs @monkvision/react-native
```

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/master/packages/react-native-views/package.json):
 ``` json
"@monkvision/corejs": "*",
"@monkvision/react-native": "*",
 ```

