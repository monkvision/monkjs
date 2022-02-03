---
id: picturing
title: "📷 Taking pictures"
slug: /js/guides/picturing
---

Open a React based project with our favorite IDE, then import the Camera view called ``Capture``.

```javascript
/* App.jsx */

import React, { useCallback, useState } from 'react';
import { Capture, Controls } from '@monkvision/camera';
import { SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [loading, setLoading] = useState();

  const handleCapture = useCallback(async (api) => {
    const { takePictureAsync, startUploadAsync, goNextSight } = api;

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
        inspectionId="999999999-0000-0000-9999-999999999999"
        controls={controls}
        loading={loading}
      />
    </SafeAreaView>
  );
}
```

This will create a tunnel view for taking pictures. `<Capture />` takes callbacks and compose with your own logic.

**See the [Capture API](/docs/js/api/components/capture) to more details.**

## What's next?

You surely want to analyze and manipulate photos via Monk's predictions,
but first we will see how to authenticate before executing a request to our API.
