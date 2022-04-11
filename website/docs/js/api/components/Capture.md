---
id: capture
title: "Capture"
slug: /js/api/components/capture
---

**Interface guiding user in a 360° vehicle capture coverage.**

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

```yarn
yarn add @monkvision/corejs @monkvision/sights @monkvision/toolkit @monkvision/camera
```

``` javascript
import { Capture } from '@monkvision/camera';
```

# Basic usage

Here is an example of uploading one image to an inspection on the browser with the task `damage_detection` set.

```javascript
import React, { useCallback, useState } from 'react';
import { Capture, Controls, Constants, useUploads } from '@monkvision/camera';
import { SafeAreaView, StatusBar } from 'react-native';

export default function Inspector({ inspectionId }) {
  const [loading, setLoading] = useState();

  const uploads = useUploads({ sightIds: Constants.defaultSightIds });

  const controls = [{
    disabled: loading,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Capture
        sightIds={Constants.defaultSightIds}
        inspectionId={inspectionId}
        controls={controls}
        uploads={uploads}
        loading={loading}
        onReady={() => setLoading(false)}
        onCaptureTourStart={() => console.log('Capture tour process has finished')}

        /** --- With picture quality check
         * enableComplianceCheck={true}
         * onComplianceCheckFinish={() => console.log('Picture quality check process has finished')}
         */
      />
    </SafeAreaView>
  );
}
```

# Advanced usage

This is the same example but using a **custom capture handler** function, which will override the built-in one.

```javascript
import React, { useCallback, useState } from 'react';
import { Capture, Controls, Constants, useUploads } from '@monkvision/camera';
import { SafeAreaView, StatusBar } from 'react-native';

export default function Inspector({ inspectionId }) {
  const [loading, setLoading] = useState();

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    const { takePictureAsync, startUploadAsync, goNextSight } = api;

    const picture = await takePictureAsync();
    setLoading(false);

    goNextSight();
    startUploadAsync(picture);

    // Add success condition...
  }, []);

  const uploads = useUploads({ sightIds: Constants.defaultSightIds });

  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Capture
        sightIds={Constants.defaultSightIds}
        inspectionId={inspectionId}
        controls={controls}
        uploads={uploads}
        loading={loading}
        onReady={() => setLoading(false)}
        onCaptureTourStart={() => console.log('Capture tour process has finished')}

        /** --- With picture quality check
         * enableComplianceCheck={true}
         * onComplianceCheckFinish={() => console.log('Picture quality check process has finished')}
         */
      />
    </SafeAreaView>
  );
}
```

# Props

## controls
`PropTypes.arrayOf(PropTypes.shape({ component: PropTypes.element, disabled: PropTypes.bool, onPress: PropTypes.func }))`

An array of props inherited from `TouchableOpacity|*`
> If we pass the `onPress` callback the built-in capture handler will not be used.

```js
const controls = [{
  disabled: loading,
  onPress: handleCapture,
  ...Controls.CaptureButtonProps,
}];
```

## footer
`PropTypes.element`

A rendered element to be display has footer of the Sights scroll list

## fullscreen
`PropTypes.objectOf(PropTypes.any)`

Props inherited from `Button`

## initialState
`PropTypes.state`

InitialState to begin with. Very useful if you persist the state
on each change from [`onChange`](#onchange) callback.
See the [`state`](#state) section for more details.

## inspectionId
`PropTypes.string`

ID of an inspection if you want to use component's API like [`startUploadAsync`](#startuploadasync).

## loading
`PropTypes.bool`

A boolean showing an ActivityIndicator and disabling controls if true

## isSubmitting
`PropTypes.bool`

A boolean disabling the submit button if true, inside Upload Center (picture quality check screen).

## submitButtonLabel
`PropTypes.string`

The label of the submit button, by default is `Skip retaking`.

## navigationOptions
```js
PropTypes.shape({
  allowNavigate: PropTypes.bool,
  allowRetake: PropTypes.bool,
  allowSkip: PropTypes.bool,
  retakeMaxTry: PropTypes.number,
  retakeMinTry: PropTypes.number,
})
```

### allowNavigate
`PropTypes.bool`

A boolean allowing user to navigate between sight. Default is `false`.

### allowRetake
`PropTypes.bool`

A boolean allowing user to retake a picture if not compliant. Default is `true`.

### allowSkip
`PropTypes.bool`

A boolean allowing user to skip a sight if he is not capable of taking it. Default is `false`.

### retakeMaxTry
`PropTypes.number`

A number setting the max limit of retake tries. Default is `1`.

### retakeMinTry
`PropTypes.number`

A number setting the min limit of retake tries. Default is `1`.

> Current scenario is user has to retake at least 1 (`retakeMinTry`) picture,
> but can retake only 1 (`retakeMaxTry`) before being redirected to the next stage,
> only if picture is not compliant to `Image Quality Check` or `Car 360° coverage`.

## onChange
`PropTypes.func`

Will call a function when the Component state has changed.

```js
const handleChange = (state, api) => console.log(state);
```

## onReady
`PropTypes.func`

Will call a function when the Component camera is ready to be used.

```js
const handleReady = (state, api) => console.log(state);
```

## onCaptureTourStart
`PropTypes.func`

Will call a function when the Capture tour starts.

```js
const handleCaptureTourStart = () => console.log('Capture tour has started');
```

## onCaptureTourFinish
`PropTypes.func`

Will call a function when the Capture tour finishes.

```js
const handleCaptureTourFinish = () => console.log('Capture tour has finished');
```

## onComplianceCheckStart
`PropTypes.func`

Will call a function when the picture qualty check starts.

```js
const handleComplianceCheckStart = () => console.log('Picture quality check has started');
```

## onComplianceCheckFinish
`PropTypes.func`

Will call a function when the picture qualty check finishes.

```js
const handleComplianceCheckFinish = () => console.log('Picture quality check has finished');
```

## onRetakeAll
`PropTypes.func`

Will call a function when pressing `retakeAll` button inside the Upload Center (picture quality check screen).

```js
const handleRetakeAll = () => console.log('Retaking all...');
```

## onStartUploadPicture
`PropTypes.func`

Will call a function when start uploading every picture.

```js
const handleStartUploadPicture = (state, api) => console.log('Started uploading a picture');
```

## onFinishUploadPicture
`PropTypes.func`

Will call a function when the uploading is finished for every picture.

```js
const handleFinishUploadPicture = (state, api) => console.log('Finished uploading a picture');
```

## primaryColor
`PropTypes.string`

Custom color for better user experience (default is white)

## sightIds
`PropTypes.arrayOf(PropTypes.string)`

List of sights in order you want theme to be displayed.
See [monkjs/sights](/monkjs/sights) to choose sights you want.


## task
`PropTypes.oneOfType([PropTypes.string, PropTypes.object])`

A string or object specifying the task that will be used in all sights, by default it's `damage_detection`

```js
<Capture task="wheel_analysis" />
// or
<Capture task={{ name: 'images_ocr', image_details: { image_type: 'VIN' } }} />
```

## mapTasksToSights
`PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      tasks: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    }),
  )`

An array of objects containing the `id` of a sight and an array of `tasks`, useful in case we want to run multiple tasks on one image.


> Every image will run the task coming from the `task` prop by default, unless you specify its `id` using `mapTasksToSights`.

```js
[
  { id: 'sLu0CfOt', tasks: [{ name: 'images_ocr', image_details: { image_type: 'VIN' } }] },
  { id: 'WKJlxkiF', tasks: ['damage_detection'] },
  { id: 'cDe2q69X', tasks: ['damage_detection', 'wheel_analysis'] },
]
```

----

# States and Methods

## state
```js
console.log(state); // { isReady, settings, sights, uploads };
```

### settings
See [Expo Camera Props](https://docs.expo.dev/versions/latest/sdk/camera/#props)

### sights
````js
const sights = useSights({ sightIds });
console.log(sights); // { state, distpatch }
console.log(sights.state); // {current: { id, index, metadata }, ids, remainingPictures, takenPictures, tour }
````

### uploads
````js
const uploads = useUploads({ sightIds });
console.log(uploads); // { state, distpatch }
console.log(uploads.state); // { sightId: { picture: null, status: 'idle', error: null, uploadCount: 0 } }
````

### compliance
````js
const compliance = useCompliance({ sightIds });
console.log(compliance); // { state, distpatch }
console.log(compliance.state); // { sightId: { id: '', status: 'idle', error: null, requestCount: 0, result: null, imageId: null } }
````

## api
```js
console.log(API); // { camera, goPrevSight, goNextSight, setPictureAsync, startUploadAsync, takePictureAsync };
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
const picture = await takePictureAsync();
console.log('Picture has been taken!')
setLoading(false);

// Don't set Loading to true if you want Async uploads
const uploadResult = await startUploadAsync(picture);
console.log('Upload has succeed!')
```

### setPictureAsync,
Set picture in the component state

```js
const picture = await takePictureAsync();
setPictureAsync(picture);
```

### startUploadAsync
Call a promise starting to upload a picture to Monk API

```js
const uploadResult = await startUploadAsync(picture);
console.log('Upload has succeed!')
```

----

## Style

### controlsContainerStyle
`PropTypes.style`

Style of the control's container (layout side right).

### sightsContainerStyle
`PropTypes.style`

Style of the sight's scroll list container (layout side left).

### thumbnailStyle
`PropTypes.style`

Style of a thumbnail in a sights list.
