---
id: react-native
title: "React Native"
slug: /js/api/react-native
---
![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native/latest.svg)

Install with `npm`
``` npm
npm install @monkvision/react-native
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native
```

⛓️ Dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/react-native/package.json):
 ``` json
"dependencies": {
  "@expo/vector-icons": "^12.0.5",
  "@emotion/is-prop-valid": "^1.1.0",
  "@unimodules/core": "^7.1.2",
  "@unimodules/react-native-adapter": "^6.3.9",
  "expo-camera": "^11.2.2",
  "expo-font": "^9.2.1",
  "expo-screen-orientation": "^3.2.1",
  "lodash.camelcase": "^4.3.0",
  "lodash.isboolean": "^3.0.3",
  "lodash.isempty": "^4.4.0",
  "lodash.isplainobject": "^4.0.6",
  "lodash.noop": "^3.0.1",
  "react-native-animation-library": "^0.0.8",
  "react-native-svg": "^12.1.1",
  "react-native-vector-icons": "^8.1.0",
  "react-native-web": "^0.17.5",
  "react-native-xml2js": "^1.0.3",
  "tinycolor2": "^1.4.2",
  "xml2js": "^0.4.23"
},
"peerDependencies": {
  "@monkvision/corejs": "1.1.3",
  "react": "*",
  "react-native": "*"
}
 ```

# Views

![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native-views/latest.svg)

Install with `npm`
``` npm
npm install @monkvision/react-native-views @monkvision/corejs @monkvision/react-native --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native-views @monkvision/corejs @monkvision/react-native
```

> Note: this module requires `react-native-paper` for basic use of Monk.
> For full customization of our components, please refer to `@monkvision/react-native`

⛓️ Dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/react-native-views/package.json):
 ``` json
"dependencies": {
  "react-native-paper": "^4.9.2"
},
"peerDependencies": {
  "@monkvision/corejs": "1.1.3",
  "@monkvision/react-native": "1.1.3"
}
 ```

## CameraView

``` javascript
import { CameraView } from '@monkvision/react-native-views';
```

```
isLoading: bool,
onCloseCamera: ({ camera, pictures, sights }) => ( ... ),
onShowAdvice: ({ camera, pictures, sights }) => ( ... )
onSuccess: ({ camera, pictures, sights }) => ( ... ),
onTakePicture: ({ picture, sight }) => ( ... ),
sights: [],
```
