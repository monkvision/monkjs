import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import isEmpty from 'lodash.isempty';

import { Capture, Controls, UploadCenter } from '@monkvision/camera';
import { Loader } from '@monkvision/ui';

// You can also import already transpiled file.
// import { inspection, task } from '@monkvision/corejs';
import * as inspection from '@monkvision/corejs/src/inspections';
import * as task from '@monkvision/corejs/src/tasks';

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

      const { result } = await inspection.createOne({ data });
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
    await task.updateOne({ inspectionId, name, data });

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
