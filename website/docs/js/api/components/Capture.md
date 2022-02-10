---
id: capture
title: "Capture"
slug: /js/api/components/capture
---

**Interface guiding user in a 360 vehicle capture process.**

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

```yarn
yarn add @monkvision/camera
```

``` javascript
import { Capture } from '@monkvision/camera';
```

Here an example to upload one image to an inspection on the browser with the task `damage_detection` set.

```javascript
import React, { useCallback, useState } from 'react';
import { Capture, Controls } from '@monkvision/camera';
import { SafeAreaView, StatusBar } from 'react-native';

export default function Inspector({ inspectionId }) {
  const [loading, setLoading] = useState();

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    const { takePictureAsync, startUploadAsync, goNextSight } = api;

    setTimeout(async () => {
      setLoading(true);
      const { picture } = await takePictureAsync();
      console.log('Picture has been taken!')
      setLoading(false);

      goNextSight();

      const uploadResult = await startUploadAsync(picture);
      console.log('Upload has succeed!')
    }, 150);
  }, []);

  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Capture
        inspectionId={inspectionId}
        controls={controls}
        loading={loading}
      />
    </SafeAreaView>
  );
}
```

## controls
`PropTypes.arrayOf(PropTypes.shape({ component: PropTypes.element, disabled: PropTypes.bool, onPress: PropTypes.func }))`

An array of props inherited from TouchableOpacity|*

```js
const controls = [{
  disabled: loading,
  onPress: handleCapture,
  ...Controls.CaptureButtonProps,
}];
```

## footer
`PropTypes.element`

A rendered element to be display has footer of the Sights scrool list

## fullscreen
`PropTypes.objectOf(PropTypes.any)`

Props inherited from Button

## loading
`PropTypes.bool`

A boolean showing an ActivityIndicator and disabling controls if true

## onChange
`PropTypes.func`

Will call a function when Component state has changed.

```js
const handleChange = (state, api) => console.log(state);
```

## onReady
`PropTypes.func`

Will call a function when Component camera is ready to be used.

```js
const handleReady = (state, api) => console.log(state);
```

## primaryColor
`PropTypes.string`

Custom color for better user experience (default is white)

## sightIds
`PropTypes.arrayOf(PropTypes.string)`

List of sights in order you want theme to be displayed.
See [monkjs/sights](https://monkvision.github.io/monkjs/sights) to choose sights you want.

----

## state
```js
console.log(state); // { isReady, settings, sights, uploads };
```

### settings
See [Expo Camera Props](https://docs.expo.dev/versions/latest/sdk/camera/#props)

### sights
````js
const sights = useSights(sightIds);
console.log(sights); // { state, distpatch }
console.log(sights.state); // {current: { id, index, metadata }, ids, remainingPictures, takenPictures, tour }
````

### uploads
````js
const uploads = useSights(sightIds);
console.log(uploads); // { state, distpatch }
console.log(uploads.state); // { sightId: { picture: null, status: 'idle', error: null, uploadCount: 0 } }
````

## API
```js
console.log(API); // { camera, goPrevSight, goNextSight, startUploadAsync, takePictureAsync };
```

### camera
See [Expo Camera API](https://docs.expo.dev/versions/latest/sdk/camera/)

### goPrevSight
Dispatch action to return to the previous Sight in the `sightIds` prop order

### goNextSight
Dispatch action to go to the next Sight in the `sightIds` prop order

### startUploadAsync
Call a promise starting to upload a picture to Monk API

```js
const uploadResult = await startUploadAsync(picture);
console.log('Upload has succeed!')
```

### takePictureAsync
Call a promise starting to take a picture from the Native or browser camera

```js
setLoading(true);
const { picture } = await takePictureAsync();
console.log('Picture has been taken!')
setLoading(false);

// Don't set Loading to true if you want Async uploads
const uploadResult = await startUploadAsync(picture);
console.log('Upload has succeed!')
```
