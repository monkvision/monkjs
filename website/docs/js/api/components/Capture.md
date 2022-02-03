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

  const handleCapture = useCallback(async (monk) => {
    const { takePictureAsync, startUploadAsync, goNextSight } = monk;

    setLoading(true);
    const { picture } = await takePictureAsync();

    setTimeout(() => {
      setLoading(false);
      goNextSight();
      startUploadAsync(picture);
    }, 200);
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

## onChange
`PropTypes.func`

Will call a function when Component state has changed.

```javascript
const handleChange = (state) => console.log(state);

<CaptureTour onChange={handleChange}/>
```

## sightIds
`PropTypes.arrayOf(PropTypes.string)`
