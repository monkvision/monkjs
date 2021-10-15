---
id: picturing
title: "📷 Taking pictures"
slug: /js/guides/picturing
---

`import { CameraView } from '@monkvision/react-native-views';`

``` javascript
/* MyCameraView.jsx */

import React, { useCallback } from 'react';
import { CameraView } from '@monkvision/react-native-views';

export default function MyCameraView() {
  const handleCloseCamera = useCallback((pictures) => {
    console.log(pictures); // [[Sight, CameraPicture], ...]
  }, []);

  const handleTakePicture = useCallback((picture) => {
    console.log(picture); // [Sight, CameraPicture]
  }, []);

  return (
    <CameraView
      onCloseCamera={handleCloseCamera}
      onTakePicture={handleTakePicture}
      analyzeAfterCapture
    />
  );
}
```

**See the [CameraView API](https://monkvision.github.io/monkjs/docs/js/api/react-native-views#cameraview) to more details.**

## Sights

A capture scheme is a list of sights `[Sight]` with a unique string `id` and [cylindrical coordinates](https://en.wikipedia.org/wiki/Cylindrical_coordinate_system).

> If our AI can work without this metadata, it analyzes much more easily with it. The Camera view then embeds a list of default sights that you can customize in the near future.

`const sight = new Sight('abstractFront', [null, 0, null], 'Front');`

This scheme will enable a wheel indicator displaying the angle we need to take the picture.
Plus an overlay is completing the view helping to take position before taking the picture.

``` json
/* picture */
{
  "abstractFront": {
    "sight": Sight,
    "source": { "uri":"data:image/png;base64", "width":640, "height":480, "exif":{...} }
  }
}
```

## What's next?

You surely want to analyze and manipulate photos via Monk's predictions,
but first we will see how to authenticate before executing a request to our API.
