---
id: picturing
title: "📷 Taking pictures"
slug: /js/guides/picturing
---
Our guide will help you implement a Camera module in your React application, web or native.

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

```yarn
yarn add @monkvision/corejs @monkvision/sights @monkvision/toolkit @monkvision/camera
```

## Principles
The `@monkvision/camera` module is base of `expo-camera` where we added features to enhance
picture quality and compliance. We made specific sights & overlays in order to improve
AI performance. **To make it simple, it's a camera module tailored for vehicle inspections.**

### Native
In native, we have access to the OS API via the React Native bridge.
The constraints are only the one set by the operating system (Android, iOS).

[More details on Expo documentation](https://docs.expo.dev/versions/latest/sdk/camera/)

### Browser
In the browser, we use the UserMedia API provide by the browser.
Quality isn't limited at all, but performance or compatibility can be
since we use another layer between us and the machine.


[More details on Expo documentation](https://docs.expo.dev/versions/latest/sdk/camera/)

### What should I choose ?
Our module works in both environment. Choose what is easier to implement for now
in your current project application.

## Example
Here a full example on how taking picture with the `<Capture />` component.

```js
/* Inspector.jsx */

import React, { useCallback, useEffect, useState } from 'react';
import { Capture, Controls } from '@monkvision/camera';

const sightIds = [
  'GHbWVnMB',
  'GvCtVnoD',
  'IVcF1dOP',
  'LE9h1xh0',
  'PLh198NC',
  'UHZkpCuK',
  'XyeyZlaU',
  'vLcBGkeh',
  'Pzgw0WGe',
  'EqLDVYj3',
  'jqJOb6Ov',
  'j3E2UHFc',
  'AoO-nOoM',
  'B5s1CWT-',
];

export default function Inspector() {
  const [inspectionId, setInspectionId] = useState();
  const [isValidating, setValidating] = useState(false);
  const [loading, setLoading] = useState();

  const createNewInspection = useCallback(async () => {
    const response = await monkApi.inspection.createOne({
      data: {
        tasks: {
          damage_detection: {
            status: monkApi.task.STATUSES.notStarted,
          },
        },
      },
    });

    setInspectionId(response.result);

    return response;
  }, []);

  const handleValidate = useCallback(async () => {
    if (!isValidating) {
      setValidating(true);
      await createNewInspection();
      setValidating(false);
    }
  }, [createNewInspection, isValidating]);

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
    } = api;

    const picture = await takePictureAsync();
    setPictureAsync(picture);

    const { sights } = state;
    const { camera } = api;
    const { current, ids, takenPictures } = sights.state;

    if (current.index === ids.length - 1) {
      await startUploadAsync(picture);

      setLoading(false);
      handleValidate();
    } else {
      setLoading(false);
      goNextSight();
      startUploadAsync(picture);
    }
  }, [handleValidate]);

  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  useEffect(() => {
    createNewInspection();
  }, [createNewInspection]);

  if (isValidating) {
    return <Loading />;
  }

  return (
    <Capture
      controls={controls}
      inspectionId={inspectionId}
      sightIds={sightIds}
      loading={loading}
    />
  );
}
```

**See the [Capture API](/docs/js/api/components/capture) to more details.**

## What's next?

You surely want to analyze and manipulate photos via Monk's predictions,
but first we will see how to authenticate before executing a request to our API.
