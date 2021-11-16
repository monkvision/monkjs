---
id: picturing
title: "📷 Taking pictures"
slug: /js/guides/picturing
---

We open a React based project with our favorite IDE, then we import the Camera view.

```javascript
/* App.jsx */

import React from 'react';
import { useIcons } from '@monkvision/react-native';
import { CameraView, theme } from '@monkvision/react-native-views';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  useIcons();

  return (
    <PaperProvider theme={theme}>
      <CameraView />
    </PaperProvider>
  );
}
```

This will create a tunnel view for taking pictures. ``<CameraView />`` takes callbacks and compose with your own logic.

```javascript
const handleCloseCamera = React.useCallback((pictures) => {
    console.log(pictures); // [[Sight, Source], ...]
  }, []);

const handleTakePicture = React.useCallback((picture) => {
  console.log(picture); // [Sight, Source]
}, []);

return (
  <CameraView
    onCloseCamera={handleCloseCamera}
    onTakePicture={handleTakePicture}
  />
);
```

**See the [CameraView API](https://monkvision.github.io/monkjs/docs/js/api/react-native-views#cameraview) to more details.**

## Sights

A capture scheme is a list of sights `[Sight]` with a unique string `id` and [cylindrical coordinates](https://en.wikipedia.org/wiki/Cylindrical_coordinate_system).

> If our AI can work without this metadata, it analyzes much more easily with it. The Camera view then embeds a list of default sights that you can customize in the near future.

`const sight = new Sight('abstractFront', [null, 0, null], 'Front', ['exterior']);`

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
