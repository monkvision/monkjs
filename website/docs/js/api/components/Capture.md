---
id: capture
title: "Capture"
slug: /js/api/components/capture
---

**Interface guiding user in a 360 vehicle capture process.**

![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native-views/latest.svg)

```yarn
yarn add @monkvision/camera
```

``` javascript
import { Capture } from '@monkvision/camera';
```

Here an example to upload one image to an inspection with the task `damage_detection` set.

```javascript
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { Capture } from '@monkvision/camera';
import { monkApi } from '@monkvision/corejs';

function Inspector({ inspectionId }) {
  const handleCapture = useCallback(async (payload) => {
    const { id, label } = payload.metadata;
    const { uri } = payload.picture;

    try {
      const filename = `${id}-${inspectionId}.jpg`;
      const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

      const acquisition = { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image };
      const json = JSON.stringify({ acquisition, tasks: ['damage_detection'] });

      const data = new FormData();
      data.append(multiPartKeys.json, json);

      if (Platform.OS === 'web') {
        const blobUri = await fetch(uri);
        const blob = await blobUri.blob();
        const file = await new File(
          [blob],
          multiPartKeys.filename,
          { type: multiPartKeys.type },
        );
        data.append(multiPartKeys.image, file);
      } else {
        // Transform URI into Native File
      }

      await monkApi.images.addOne({ inspectionId, data });

      console.log(`${label} picture was uploaded!`);
    } catch (e) {
      console.error(e);
    }
  }, [inspectionId]);


  return <Capture onCapture={handleCapture} />;
}
```

## buttonCaptureProps
`PropTypes.objectOf(PropTypes.any)`

Props given to the Capture button.

```javascript
const buttonCaptureProps = { disabled: true };

<CaptureTour buttonCaptureProps={buttonCaptureProps}/>
```

## buttonFullScreenProps `web only`
`PropTypes.objectOf(PropTypes.any)`

```javascript
const buttonFullScreenProps = { hidden: true };

<CaptureTour buttonFullScreenProps={buttonFullScreenProps}/>
```

## buttonResetProps
`PropTypes.objectOf(PropTypes.any)`

```javascript
const buttonResetProps = { hidden: true };

<CaptureTour buttonResetProps={buttonResetProps}/>
```

## buttonSettingsProps
`PropTypes.objectOf(PropTypes.any)`

```javascript
const buttonSettingsProps = { hidden: true };

<CaptureTour buttonSettingsProps={buttonSettingsProps}/>
```

## buttonValidateProps
`PropTypes.objectOf(PropTypes.any)`

```javascript
const buttonValidateProps = { hidden: true };

<CaptureTour buttonValidateProps={buttonValidateProps}/>
```

## onCapture
`PropTypes.func`

Will call a function when the camera has taken a picture. You can use `@monkvision/corejs` API to upload the picture to an inspection for example.

```javascript
const handleCapture = (payload) => console.log(payload);

<CaptureTour onTakePicture={handleCapture}/>
```

```javascript
const payload = {
  picture: { uri },
  camera, // https://docs.expo.dev/versions/latest/sdk/camera/
  sights: {
    current: {
      id,
      metadata,
    },
  },
};
```

## onChange
`PropTypes.func`

Will call a function when Component state has changed.

```javascript
const handleChange = (state) => console.log(state);

<CaptureTour onChange={handleChange}/>
```

```javascript
const state = {
  sights: {
    current: {
      id,
      index,
      metadata,
    },
    ids,
    remainingPictures,
    takenPictures,
    tour,
  },
  settings: {
    ratio: '4:3',
    zoom
  }
};
```

## onOffline
`PropTypes.func`

Will call a function when the user press on the "Reset" button control.

```javascript
const handleOffline = (offline) => console.log(offline ? 'offline' : 'online');

<CaptureTour onOffline={handleOffline}/>
```

## onReset
`PropTypes.func`

Will call a function when the user press on the "Reset" button control.

```javascript
const handleReset = () => console.log('Reset');

<CaptureTour onValidate={handleReset}/>
```

## onSettings
`PropTypes.func`

Will call a function when the user press on the "Settings" button control.

```javascript
const handleSettings = () => console.log('Settings');

<CaptureTour onSettings={handleSettings}/>
```

## onValidate
`PropTypes.func`

Will call a function when the user press on the "Validate" button control.

```javascript
const handleValidate = () => console.log('Validate');

<CaptureTour onValidate={handleValidate}/>
```

## sightIds
`PropTypes.arrayOf(PropTypes.string)`
