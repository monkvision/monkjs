import React, { useCallback, useEffect, useState } from 'react';
import { Capture, Controls } from '@monkvision/camera';
import { monkApi } from '@monkvision/corejs';
import Loading from 'views/Loading';

export default function Inspector() {
  const [inspectionId, setInspectionId] = useState();
  const [isValidating, setValidating] = useState(false);

  const [loading, setLoading] = useState(false);

  const createNewInspection = useCallback(async () => {
    try {
      const response = await monkApi.inspections.createOne({
        data: { tasks: { damage_detection: { status: 'NOT_STARTED' } } },
      });

      setInspectionId(response.data.id);
      setValidating(false);
    } catch (e) {
      setValidating(false);
    }
  }, []);

    const handleSuccess = useCallback(() => {
      // TODO handleSucess - exemple: requests.updateTask.request();
      setValidating(true);
      createNewInspection();
  }, [requests]);

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    const {
      takePictureAsync,
      startUploadAsync,
      setPictureAsync,
      goNextSight,
      checkComplianceAsync,
    } = api;

    const picture = await takePictureAsync();
    setPictureAsync(picture);

    const { sights } = state;
    const { current, ids } = sights.state;

    if (current.index === ids.length - 1) {
      const upload = await startUploadAsync(picture);
      if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }

      setLoading(false);
    } else {
      setLoading(false);
      goNextSight();

      const upload = await startUploadAsync(picture);
      if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }
    }
  }, []);

  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  useEffect(() => {
    createNewInspection();
  }, [createNewInspection]);

  if (isValidating) {
    return <Loading />
  }

  return (
    <Capture
      inspectionId={inspectionId}
      controls={controls}
      loading={loading}
      renderOnFinish={UploadCenter}
      submitButtonProps={{
        title: 'Next',
        onPress: handleSuccess,
      }}
    />
  );

}
