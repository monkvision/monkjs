import React, { useCallback, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

import useRequests from 'screens/InspectionCreate/useRequests';
import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls, useUploads, UploadCenter } from '@monkvision/camera';

const sightIds = [
  'WKJlxkiF', // Beauty Shot
  'vxRr9chD', // Front Bumper Side Left
  'cDe2q69X', // Front Fender Left
  'R_f4g8MN', // Doors Left
  'vedHBC2n', // Front Roof Left
  'McR3TJK0', // Rear Lateral Left
  '7bTC-nGS', // Rear Fender Left
  'hhCBI9oZ', // Rear
  'e_QIW30o', // Rear Fender Right
  'fDo5M0Fp', // Rear Lateral Right
  'fDKWkHHp', // Doors Right
  '5CFsFvj7', // Front Fender Right
  'g30kyiVH', // Front Bumper Side Right
  'I0cOpT1e', // Front
  'IqwSM3', // Front seats
  'rSvk2C', // Dashboard
  'rj5mhm', // Back seats
  'qhKA2z', // Trunk
];

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

  const uploads = useUploads({ sightIds });

  return (
    <SafeAreaView>
      <Capture
        sightIds={sightIds}
        inspectionId={inspectionId}
        controls={controls}
        loading={loading}
        uploads={uploads}
        renderOnFinish={UploadCenter}
        submitButtonProps={{
          title: 'Skip Retaking',
          onPress: handleSuccess,
        }}
      />
    </SafeAreaView>
  );
};
