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
picture quality and compliance.

> We made specific sights & overlays in order to improve
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

## Examples

You can follow this steps by steps tutorial
or go directly to the [full example](#full-example)
on how taking picture with the `<Capture />` component.

### Get an inspection first
You can use your own routing system or directly create on new inspection.
The must important is to have **a valid** `inspectionId`.

```js
/* Inspector.jsx */

import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import isEmpty from 'lodash.isempty';

import monk from '@monkvision/corejs';
import { Loader } from '@monkvision/ui';

export default () => {
  const route = useRoute();
  // Use a loading state to have better control over your components.
  const [loading, setLoading] = useState();

  // Here we're getting an inspectionId from a route param.
  const [inspectionId, setInspectionId] = useState(route.params.inspectionId);

  // But we set a callback to create a new Inspection if the id is empty
  // @see https://monkvision.github.io/monkjs/docs/js/api/inspection#createone
  const createNewInspection = useCallback(async () => {
    if (isEmpty(inspectionId)) {
      const tasks = { [task.NAMES.damageDetection]: { status: task.STATUSES.notStarted } };
      const data = { tasks };

      const { result } = await monk.entity.inspection.upsertOne({ data });
      setInspectionId(result);
    }
  }, [inspectionId]);

  useEffect(() => {
    createNewInspection();
  }, [createNewInspection]);

  // Showing the `<Loader />` when the inspection
  // hasn't been created yet.
  if (isEmpty(inspectionId) && loading) {
    return (
      <Loader texts={[
        'Creating inspection...',
        'Requesting a new ID...',
        'Getting started...',
        'Calling servers...',
      ]}
      />
    );
  }

  return (
    <View>
      <Text>
        Inspection:
        {inspectionId}
      </Text>
    </View>
  );
};
```

### Define controls and callbacks
We now need a button and a callback to capture an image.

Define first the async `handleCapture(state, api, event)` callback.
```js
const handleCapture = useCallback(async (state, api, event) => {
  event.preventDefault();
  setLoading(true);

  // @see https://monkvision.github.io/monkjs/docs/js/api/components/capture#state
  const {
    takePictureAsync,
    startUploadAsync,
    setPictureAsync,
    goNextSight,
    checkComplianceAsync,
  } = api;

  // We await the picture to be taken by Native camera or Web getUserMedia()
  const picture = await takePictureAsync();

  // After a raw picture being taken in full resolution
  // We asynchronously create a low res thumbnail
  // to display in the interface.
  setPictureAsync(picture);

  // @see https://monkvision.github.io/monkjs/docs/js/api/components/capture#states
  const { sights } = state;
  const { current, ids } = sights.state;

  // Last index means the end of the tour,
  // if we are not allowed to skip or navigate
  // between sights.
  // @see https://monkvision.github.io/monkjs/docs/js/api/components/capture#navigationoptions
  const lastIndex = current.index === ids.length - 1;

  // If this is not the end,
  // we don't wait upload to start or stop,
  // and we go directly to the next sight
  if (!lastIndex) {
    setLoading(false);
    goNextSight();
  }

  // We start the upload and we await the result.
  // If the upload went well, we check the quality
  // and the compliance of the picture.
  const upload = await startUploadAsync(picture);
  const uploadId = upload.data?.id;
  if (uploadId) { await checkComplianceAsync(uploadId); }

  // Now we took the last picture of the list.
  if (lastIndex) {
    setLoading(false);
    // Do something here at the end
    // or use the renderOnFinish `<Capture />` prop.
  }
}, []);
```

Then create a control button with our freshly defined callback.
```js
import { Controls } from '@monkvision/camera';
```

```js
const controls = [{
  disabled: loading,
  onPress: handleCapture,
  ...Controls.CaptureButtonProps,
}];
```

### Render the `<Capture />` component
Now we have everything to take picture except the rendering component.

First import it from `@monkvision/camera`.
```js
import { Capture, Controls } from '@monkvision/camera';
```

Then make it the returned Element of your _Inspector_ function component.
```js
return (
  <Capture
    inspectionId={inspectionId}
    controls={controls}
    loading={loading}
  />
);
```

### Start the damage detection task
Now that we can get pictures, we want to treat them before starting a task.

Using the `UploadCenter` component is the best way to see statuses
and to be able to retake low quality pictures.
```js
import { Capture, Controls, UploadCenter } from '@monkvision/camera';
```

```js
return (
  <Capture
    inspectionId={inspectionId}
    controls={controls}
    loading={loading}
    renderOnFinish={UploadCenter}
  />
);
```

Combined with the `submitButtonProps` prop,
you can control validation and do whatever you want
as going success with the Capture workflow.

We define another async callback called `handleSuccess()`
to start a damage detection task whe the user press the submit button.
```js
const handleSuccess = useCallback(async () => {
  setLoading(true);

  const name = task.NAMES.damageDetection;
  const data = { status: task.STATUSES.todo };

  // Here we use the corejs API to update one task of an inspection.
  // @see https://monkvision.github.io/monkjs/docs/js/api/task#updateone
  await monk.entity.task.updateOne({ inspectionId, name, data });

  setLoading(false);
}, [inspectionId]);
```

Then we set the `submitButtonProps` to the `<Capture />` component.
```js
<Capture
  inspectionId={inspectionId}
  controls={controls}
  loading={loading}
  renderOnFinish={UploadCenter}
  submitButtonProps={{
    title: 'Submit',
    disabled: loading,
    onPress: handleSuccess,
  }}
/>
```

Now we are done! You are able to take picture and send them for analysis.

### Full example
```js
/* Inspector.jsx */

import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import isEmpty from 'lodash.isempty';

import monk from '@monkvision/corejs';
import { Loader } from '@monkvision/ui';
import { Capture, Controls, UploadCenter } from '@monkvision/camera';

export default () => {
  const route = useRoute();
  // Use a loading state to have better control over your components.
  const [loading, setLoading] = useState();

  // Here we're getting an inspectionId from a route param.
  const [inspectionId, setInspectionId] = useState(route.params.inspectionId);

  // But we set a callback to create a new Inspection if the id is empty
  // @see https://monkvision.github.io/monkjs/docs/js/api/inspection#createone
  const createNewInspection = useCallback(async () => {
    if (isEmpty(inspectionId)) {
      const tasks = { [task.NAMES.damageDetection]: { status: task.STATUSES.notStarted } };
      const data = { tasks };

      const { result } = await monk.entity.inspection.upsertOne({ data });
      setInspectionId(result);
    }
  }, [inspectionId]);

  // We set a callback that will be triggered when users will submit their pictures.
  const handleSuccess = useCallback(async () => {
    setLoading(true);

    const name = task.NAMES.damageDetection;
    const data = { status: task.STATUSES.todo };

    // Here we use the corejs API to update one task of an inspection.
    // @see https://monkvision.github.io/monkjs/docs/js/api/task#updateone
    await monk.entity.task.updateOne({ inspectionId, name, data });

    setLoading(false);
  }, [inspectionId]);

  // We set another callback being triggered
  // when users are pushing the "Take picture" control button.
  // Param `event` comes from the Button Element.
  // Params `state` & `api` come from the Capture component.
  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    // @see https://monkvision.github.io/monkjs/docs/js/api/components/capture#state
    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
      checkComplianceAsync,
    } = api;

    // We await the picture to be taken by Native camera or Web getUserMedia()
    const picture = await takePictureAsync();

    // After a raw picture being taken in full resolution
    // We asynchronously create a low res thumbnail
    // to display in the interface.
    setPictureAsync(picture);

    // @see https://monkvision.github.io/monkjs/docs/js/api/components/capture#states
    const { sights } = state;
    const { current, ids } = sights.state;

    // Last index means the end of the tour,
    // if we are not allowed to skip or navigate
    // between sights.
    // @see https://monkvision.github.io/monkjs/docs/js/api/components/capture#navigationoptions
    const lastIndex = current.index === ids.length - 1;

    // If this is not the end,
    // we don't wait upload to start or stop,
    // and we go directly to the next sight
    if (!lastIndex) {
      setLoading(false);
      goNextSight();
    }

    // We start the upload and we await the result.
    // If the upload went well, we check the quality
    // and the compliance of the picture.
    const upload = await startUploadAsync(picture);
    const uploadId = upload.data?.id;
    if (uploadId) { await checkComplianceAsync(uploadId); }

    // Now we took the last picture of the list.
    if (lastIndex) {
      setLoading(false);
      // Do something here at the end
      // or use the renderOnFinish `<Capture />` prop.
    }
  }, []);

  // We define one Control button,
  // and we spread `Controls.CaptureButtonProps` to it.
  // Controls are displayed on the right of the screen.
  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  useEffect(() => {
    createNewInspection();
  }, [createNewInspection]);

  // Showing the `<Loader />` when the inspection
  // hasn't been created yet.
  if (isEmpty(inspectionId) && loading) {
    return (
      <Loader texts={[
        'Creating inspection...',
        'Requesting a new ID...',
        'Getting started...',
        'Calling servers...',
      ]}
      />
    );
  }

  // Here we render the `<Capture />` component.
  return (
    <Capture
      inspectionId={inspectionId}
      controls={controls}
      loading={loading}
      renderOnFinish={UploadCenter}
      submitButtonProps={{
        title: 'Next',
        disabled: loading,
        onPress: handleSuccess,
      }}
    />
  );
};
```

**See the [Capture API](/docs/js/api/components/capture) to more details.**

## What's next?

You will see how to perform any request on the Monk Core API and also
how to manage a fully normalize state for your application.
