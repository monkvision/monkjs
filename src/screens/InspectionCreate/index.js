import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native';

import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls, useUploads } from '@monkvision/camera';
import { useToggle, useTimeout } from '@monkvision/toolkit';
import { Loader } from '@monkvision/ui';

const CAMERA_REFRESH_DELAY = 500;
const defaultSightIds = [
  // 'WKJlxkiF', // Beauty Shot
  // 'vxRr9chD', // Front Bumper Side Left
  // 'cDe2q69X', // Front Fender Left
  // 'R_f4g8MN', // Doors Left
  // 'vedHBC2n', // Front Roof Left
  // 'McR3TJK0', // Rear Lateral Left
  // '7bTC-nGS', // Rear Fender Left
  // 'hhCBI9oZ', // Rear
  'e_QIW30o', // Rear Fender Right
  'fDo5M0Fp', // Rear Lateral Right
  'fDKWkHHp', // Doors Right
  '5CFsFvj7', // Front Fender Right
  'g30kyiVH', // Front Bumper Side Right
  'I0cOpT1e', // Front
  // 'IqwSM3', // Front seats
  // 'rSvk2C', // Dashboard
  // 'rj5mhm', // Back seats
  // 'qhKA2z', // Trunk
];

export default () => {
  const { request, isLoading, requestCount: updateTaskRequestCount, inspectionId } = useScreen();

  const [cameraloading, setCameraLoading] = useState();
  const [loading, toggleOnLoading, toggleOffLoading] = useToggle(false);
  const [allSights, setAllSights] = useState({ ids: defaultSightIds, initialState: {} });

  // refresh camera loading (Useful for a smooth retake all)
  const delay = useMemo(() => (loading ? CAMERA_REFRESH_DELAY : null), [loading]);
  useTimeout(toggleOffLoading, delay);

  // start the damage detection task
  const handleSuccess = useCallback(() => { if (updateTaskRequestCount === 0) { request(); } },
    [request, updateTaskRequestCount]);

  const uploads = useUploads({ sightIds: allSights.ids });

  const handleRetakeAll = useCallback((payload) => {
    // making it smooth with a 500ms loading and toggle off the camera loading
    toggleOnLoading();
    setCameraLoading(false);

    // update sightsIds state
    setAllSights(payload);
  }, [toggleOnLoading]);

  const controls = [{
    disabled: cameraloading,
    ...Controls.CaptureButtonProps,

    /** --- With custom capture handler ---
     * onPress: handleCapture,
    */
  }];

  /**
   * NOTE(Ilyass): it is mandatory to remove the camera from the dom and render it
   * again (reload) when we hit retake, so we get the ids to retake as the initial
   * state of the uploads
   */
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
        isSubmitting={isLoading}
        enableComplianceCheck
        onComplianceCheckFinish={handleSuccess}
        onRetakeAll={handleRetakeAll}
        onReady={() => setCameraLoading(false)}
        onStartUploadPicture={() => setCameraLoading(true)}
        onFinishUploadPicture={() => setCameraLoading(false)}

        /** --- With upload center
         * enableComplianceCheck={true}
         * onComplianceCheckStart={() => {...}}
         * onComplianceCheckFinish={() => {...}}
         * onRetakeAll={() => {...}}
         *
         * --- Without upload center
         * onCaptureTourStart={() => {...}}
         * onCaptureTourFinish={() => {...}}
         */
      />
    </SafeAreaView>
  );
};
