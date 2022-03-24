import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native';

import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls, Constants, useUploads } from '@monkvision/camera';

export default () => {
  const { request, isLoading, requestCount: updateTaskRequestCount, inspectionId } = useScreen();

  const [cameraloading, setCameraLoading] = useState();

  // start the damage detection task
  const handleSuccess = useCallback(() => { if (updateTaskRequestCount === 0) { request(); } },
    [request, updateTaskRequestCount]);

  const uploads = useUploads({ sightIds: Constants.defaultSightIds });

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
        sightIds={Constants.defaultSightIds}
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
        mapTasksToSights={[
          { id: 'WKJlxkiF', tasks: ['damage_detection'] },
          { id: 'cDe2q69X', tasks: ['damage_detection', 'wheel_analysis'] },
        ]}

        /** --- Without picture quality check
         * onCaptureTourFinish={handleSuccess}
         */
      />
    </SafeAreaView>
  );
};
