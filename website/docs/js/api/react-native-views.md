---
id: react-native-views
title: "🚀 react-native-views"
slug: /js/api/react-native-views
---
![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native-views/latest.svg)

Install with `npm`
``` npm
npm install @monkvision/react-native-views @monkvision/corejs @monkvision/react-native --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native-views @monkvision/corejs @monkvision/react-native @reduxjs/toolkit react-redux
```

> Note: this module requires `react-native-paper` for basic use of Monk.
> For full customization of our components, please refer to `@monkvision/react-native`

⛓️ Peer dependencies in [`package.json`](https://github.com/monkvision/monkjs/tree/main/packages/react-native-views/package.json):
 ``` json
"@monkvision/corejs": "*",
"@monkvision/react-native": "*",
 ```

## CameraView

``` javascript
import { CameraView } from '@monkvision/react-native-views';
```

### Response payload
`{ pictures, camera, sights, nbOfSights }`
``` json
// const handleSuccess = (payload) => console.log(payload);
// <CameraView onSuccess={handleSuccess} />

{
  "pictures": {
    "abstractFront": {
      "sight": Sight,
      "source": {
        "uri": "data:image/png;base64",
        "base64": "data:image/png;base64",
        "width": 640,
        "height": 480,
        "exif": {
          "aspectRatio": 1.3333333333333333,
          "deviceId": "3e472a239b0f0e574a61cb062f2e69cff8df2c458fdfbdc7eb3589cee7550448",
          "frameRate": 30.000030517578125,
          "groupId": "da16b5c015ee7ecafa3aa85f486560d9e7dd3f8a37a416d4819419c00b80a981",
          "resizeMode": "none",
        }
      }
    },
    "abstractFrontRight": {
      "sight": Sight,
      "source": Source
    },
  },
  "camera": Camera,
  "sights": Sights
}
```

### Types

``` javascript
CameraView.propTypes = {
  onCloseCamera: propTypes.callback,
  onSuccess: propTypes.onSuccess,
  onTakePicture: propTypes.callback,
  sights: propTypes.sights,
};
```

### Default values

``` javascript
CameraView.defaultProps = {
  onCloseCamera: noop,
  onTakePicture: noop,
  onSuccess: noop,
  sights: DefaultSights
};
```
