import React, { useCallback, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import useRequests from 'screens/InspectionCreate/useRequests';
import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls, useUploads, UploadCenter } from '@monkvision/camera';

import ValidationDialog from 'screens/InspectionCreate/ValidationDialog';

export default () => {
  const route = useRoute();
  const { inspectionId } = route.params;

  const screen = useScreen(inspectionId);
  const requests = useRequests(screen);

  const [loading, setLoading] = useState();

  const handleSuccess = useCallback(() => {
    requests.updateTask.request();
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

  const uploads = useUploads({ sightIds: Capture.defaultSightIds });

  return (
    <>
      <Capture
        inspectionId={inspectionId}
        controls={controls}
        loading={loading}
        uploads={uploads}
        renderOnFinish={UploadCenter}
        submitButtonProps={{
          title: 'Next',
          onPress: handleSuccess,
        }}
      />
      <ValidationDialog
        requests={requests}
        screen={screen}
        inspectionId={inspectionId}
      />
    </>
  );
};
