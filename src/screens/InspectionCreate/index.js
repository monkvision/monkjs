import React, { useCallback, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

import useRequests from 'screens/InspectionCreate/useRequests';
import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls, useUploads, UploadCenter } from '@monkvision/camera';
import { useToggle, useTimeout } from '@monkvision/toolkit';
import { Loader } from '@monkvision/ui';

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

  const [cameraloading, setCameraLoading] = useState();
  const [loading, toggleOnLoading, toggleOffLoading] = useToggle(false);
  const [, setSightIdsForRetake] = useState(sightIds);

  // for now we can get the all sights ids of pictures to retale
  // TODO: reset uploads state `onRetaleAll` so we can open the camera with only the bad sights ids

  // refresh camera (Useful for retake)
  const delay = useMemo(() => (loading ? 300 : null), [loading]);
  useTimeout(toggleOffLoading, delay);

  const handleSuccess = useCallback(() => {
    requests.updateTask.request();
  }, [requests]);

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setCameraLoading(true);

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

      setCameraLoading(false);
    } else {
      setCameraLoading(false);
      goNextSight();

      const upload = await startUploadAsync(picture);
      if (upload.data?.id) { await checkComplianceAsync(upload.data.id); }
    }
  }, []);

  const controls = [{
    disabled: cameraloading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  const uploads = useUploads({ sightIds });

  if (loading) { return <Loader />; }

  return (
    <SafeAreaView>
      <Capture
        sightIds={sightIds}
        inspectionId={inspectionId}
        controls={controls}
        loading={cameraloading}
        uploads={uploads}
        renderOnFinish={(props) => (
          <UploadCenter
            {...props}
            onRetakeAll={(sightsIdsToRetake) => {
              toggleOnLoading();
              setSightIdsForRetake(sightsIdsToRetake);
            }}
          />
        )}
        submitButtonProps={{
          title: 'Skip Retaking',
          onPress: handleSuccess,
        }}
      />
    </SafeAreaView>
  );
};
