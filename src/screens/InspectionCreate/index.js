import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native';

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
  const { request, isLoading, requestCount, inspectionId } = useScreen();

  const [cameraloading, setCameraLoading] = useState();
  const [loading, toggleOnLoading, toggleOffLoading] = useToggle(false);
  const [allSights, setAllSights] = useState({ ids: defaultSightIds, initialState: {} });

  // refresh camera loading (Useful for a smooth retake all)
  const delay = useMemo(() => (loading ? CAMERA_REFRESH_DELAY : null), [loading]);
  useTimeout(toggleOffLoading, delay);

  // start the damage detection task
  const handleSuccess = useCallback(() => { if (requestCount === 0) { request(); } },
    [request, requestCount]);

  const uploads = useUploads({ sightIds: allSights.ids });

  const handleRetakeAll = useCallback((sightsIdsToRetake) => {
    // adding an initialState that will hold new compliances with `requestCount = 1`
    const complianceInitialState = { id: '', status: 'idle', error: null, requestCount: 1, result: null, imageId: null };
    const complianceState = {};
    sightsIdsToRetake.forEach((id) => { complianceState[id] = { ...complianceInitialState, id }; });

    // reset uploads state with the new incoming ones
    uploads.dispatch({ type: Actions.uploads.RESET_UPLOADS, ids: { sightIds: sightsIdsToRetake } });

    // making it smooth with a 500ms loading and toggle off the camera loading
    toggleOnLoading();
    setCameraLoading(false);

    // update sightsIds state
    setAllSights({ ids: sightsIdsToRetake, initialState: { compliance: complianceState } });
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

    /**
      * here we verify if there is any campliances with status TODO (not yet ready from BE)
      * with less than 3 `requestCount`:
      * - if yes we re run recursively the compliance check after 500ms
      * - if no it will be considered as compliant to not block the user
      * */
    const verifyComplianceStatus = async (id, compliances) => {
      const hasTodo = Object.values(compliances).some((c) => c.status === 'TODO');
      if (current.requestCount <= 3 && hasTodo) {
        setTimeout(async () => {
          const result = await checkComplianceAsync(id);
          verifyComplianceStatus(id, result.data.compliances);
        }, 500);
      }
    };

    if (current.index === ids.length - 1) {
      const upload = await startUploadAsync(picture);
      if (upload.data?.id) {
        const result = await checkComplianceAsync(upload.data.id);
        verifyComplianceStatus(upload.data.id, result.data.compliances);
      }

      setCameraLoading(false);
    } else {
      setCameraLoading(false);
      goNextSight();

      const upload = await startUploadAsync(picture);
      if (upload.data?.id) {
        const result = await checkComplianceAsync(upload.data.id);
        verifyComplianceStatus(upload.data.id, result.data.compliances);
      }
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
        sightIds={allSights.ids}
        initialState={allSights.initialState}
        inspectionId={inspectionId}
        controls={controls}
        loading={cameraloading}
        uploads={uploads}
        renderOnFinish={(props) => (
          <UploadCenter
            {...props}
            onRetakeAll={handleRetakeAll}
            isSubmitting={isLoading}
          />
        )}
        submitButtonProps={{ title: 'Skip Retaking', onPress: handleSuccess }}
      />
    </SafeAreaView>
  );
};
