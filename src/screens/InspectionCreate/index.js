import React, { useCallback, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';

import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Constants, Controls, useUploads } from '@monkvision/camera';
import useIndexedDb from 'hooks/useLoadModel';
import useEmbeddedModel from '@monkvision/camera/src/hooks/useEmbeddedModel';

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#000' },
});

export default () => {
  const { request, isLoading, requestCount: updateTaskRequestCount, inspectionId } = useScreen();
  const getModels = useIndexedDb();
  const em = useEmbeddedModel();

  const [cameraLoading, setCameraLoading] = useState();
  const [model, setModel] = useState();

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      getModels(null)
        .then((res) => {
          setModel(res);
        });
    }
  }, [getModels]);

  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      if (em && em.constants && typeof em.isModelInStorage === 'function') {
        if (em.constants.MODELS.filter(em.isModelInStorage).length === em.constants.MODELS.length) {
          const input = {};
          em.constants.MODELS.forEach((name) => {
            input[name] = name;
          });
          setModel(input);
        }
      }
    }
  }, [em]);

  // start the damage detection task
  const handleSuccess = useCallback(() => { if (updateTaskRequestCount === 0) { request(); } },
    [request, updateTaskRequestCount]);

  const uploads = useUploads({ sightIds: Constants.defaultSightIds });

  const controls = [{
    disabled: cameraLoading,
    ...Controls.CaptureButtonProps,

    /** --- With custom capture handler ---
     * onPress: handleCapture,
    */
  }];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Capture
        sightIds={Constants.defaultSightIds}
        inspectionId={inspectionId}
        controls={controls}
        loading={cameraLoading}
        uploads={uploads}
        isSubmitting={isLoading}
        enableComplianceCheck
        onComplianceCheckFinish={handleSuccess}
        onReady={() => setCameraLoading(false)}
        onStartUploadPicture={() => setCameraLoading(true)}
        onFinishUploadPicture={() => setCameraLoading(false)}
        model={model}

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
