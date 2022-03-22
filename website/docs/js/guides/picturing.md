---
id: picturing
title: "📷 Taking pictures"
slug: /js/guides/picturing
---

Open a React based project with our favorite IDE, then import the Camera view called ``Capture``.

A tunnel view will be created for taking pictures. `<Capture />` takes callbacks and can be composed with your own logic.

## Basic usage

The Capture component provides a built-in capture handler which will take care of the whole capturing process.

```javascript
/* App.jsx */

import React, { useCallback, useState } from 'react';
import { Capture, Controls, Constants, useUploads } from '@monkvision/camera';
import { SafeAreaView, StatusBar } from 'react-native';

export default function App() {
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
        inspectionId="999999999-0000-0000-9999-999999999999"
        controls={controls}
        uploads={uploads}
        loading={loading}
        onReady={() => setLoading(false)}
        onStartUploadPicture={() => setLoading(true)}
        onFinishUploadPicture={() => setLoading(false)}
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

**See the [Capture API](/docs/js/api/components/capture) for more details.**

## Advanced usage

The Capture component also supports using custom capture handlers.

```javascript
/* App.jsx */

import React, { useCallback, useState } from 'react';
import { Capture, Controls, Constants, useUploads } from '@monkvision/camera';
import { SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [loading, setLoading] = useState();

  // our custom capture handler
  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
      /** --- With picture quality check ---
        checkComplianceAsync,
       */
    } = api;

    const picture = await takePictureAsync();
    setPictureAsync(picture);

    const { sights } = state;
    const { current, ids } = sights.state;

    if (current.index === ids.length - 1) {
      await startUploadAsync(picture);
      /** --- With picture quality check ---
        if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }
       */

      setLoading(false);
    } else {
      setLoading(false);
      goNextSight();

      await startUploadAsync(picture);
      /** --- With picture quality check ---
        if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }
       */
    }
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
        inspectionId="999999999-0000-0000-9999-999999999999"
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

**See the [Capture API](/docs/js/api/components/capture) for more details.**

## What's next?

You surely want to analyze and manipulate photos via Monk's predictions,
but first we will see how to authenticate before executing a request to our API.
