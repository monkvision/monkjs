import React, { useCallback, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

import useRequests from 'screens/InspectionCreate/useRequests';
import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls, useUploads, UploadCenter, Actions } from '@monkvision/camera';
import { useToggle, useTimeout } from '@monkvision/toolkit';
import { Loader } from '@monkvision/ui';

const CAMERA_REFRESH_DELAY = 500;
const defaultSightIds = [
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
  const [sightIds, setSightIdsForRetake] = useState(defaultSightIds);

  // refresh camera loading (Useful for a smooth retake all)
  const delay = useMemo(() => (loading ? CAMERA_REFRESH_DELAY : null), [loading]);
  useTimeout(toggleOffLoading, delay);

  // start the damage detection task
  const handleSuccess = useCallback(() => requests.updateTask.request(),
    [requests]);

  const uploads = useUploads({ sightIds });

  const handleRetakeAll = useCallback((sightsIdsToRetake) => {
    // reset uploads state with the new incoming ones
    uploads.dispatch({ type: Actions.uploads.RESET_UPLOADS, ids: { sightIds: sightsIdsToRetake } });

    // making it smooth with a 500ms loading
    toggleOnLoading();

    // update sightsIds state
    setSightIdsForRetake(sightsIdsToRetake);
  }, [toggleOnLoading, uploads]);

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
            onRetakeAll={handleRetakeAll}
            isSubmitting={requests.updateTask.isLoading}
          />
        )}
        submitButtonProps={{ title: 'Skip Retaking', onPress: handleSuccess }}
      />
    </SafeAreaView>
  );
};
