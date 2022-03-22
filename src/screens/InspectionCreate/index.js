import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native';

import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls, useUploads } from '@monkvision/camera';

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
  const { request, isLoading, requestCount: updateTaskRequestCount, inspectionId } = useScreen();

  const [cameraloading, setCameraLoading] = useState();

  // start the damage detection task
  const handleSuccess = useCallback(() => { if (updateTaskRequestCount === 0) { request(); } },
    [request, updateTaskRequestCount]);

  const uploads = useUploads({ sightIds });

  const controls = [{
    disabled: cameraloading,
    ...Controls.CaptureButtonProps,

    /** --- With custom capture handler ---
     * onPress: handleCapture,
    */
  }];

  return (
    <SafeAreaView>
      <Capture
        sightIds={sightIds}
        inspectionId={inspectionId}
        controls={controls}
        loading={cameraloading}
        uploads={uploads}
        isSubmitting={isLoading}
        enableComplianceCheck
        onComplianceCheckFinish={handleSuccess}
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
