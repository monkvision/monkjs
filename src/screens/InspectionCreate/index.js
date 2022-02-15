import React, { useCallback, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import useRequests from 'screens/InspectionCreate/useRequests';
import useScreen from 'screens/InspectionCreate/useScreen';

import { Capture, Controls } from '@monkvision/camera';
import ValidationDialog from 'screens/InspectionCreate/ValidationDialog';

export default () => {
  const route = useRoute();
  const { inspectionId } = route.params;

  const screen = useScreen(inspectionId);
  const requests = useRequests(screen);

  const handleSuccess = useCallback(({ camera, pictures }) => {
    camera.pausePreview();
    screen.setTourIsCompleted(true);
    screen.setVisibleDialog(true);
    requests.savePictures.preparePictures(pictures);
  }, [requests.savePictures, screen]);

  const [loading, setLoading] = useState();

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    const { takePictureAsync, startUploadAsync, goNextSight } = api;

    setTimeout(async () => {
      const picture = await takePictureAsync();
      const { sights } = state;
      const { camera } = api;
      const { current, ids, takenPictures } = sights.state;

      if (current.index === ids.length - 1) {
        await startUploadAsync(picture);
        setLoading(false);
        requests.updateTask.request();
        handleSuccess({ camera, pictures: takenPictures });
      } else {
        setLoading(false);
        startUploadAsync(picture);
        goNextSight();
      }
    }, 200);
  }, [handleSuccess, requests.updateTask]);

  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  return (
    <>
      <Capture
        inspectionId={inspectionId}
        controls={controls}
        loading={loading}
        sightIds={[
          'vLcBGkeh', // Front
          'xfbBpq3Q', // Front Bumper Side Left
          'xQKQ0bXS', // Front Wheel Left
          'VmFL3v2A', // Front Door Left
          'UHZkpCuK', // Rocker Panel Left
          'OOJDJ7go', // Rear Door Left
          '8_W2PO8L', // Rear Wheel Left
          'j8YHvnDP', // Rear Bumper Side Left
          'XyeyZlaU', // Rear
          'LDRoAPnk', // Rear Bumper Side Right
          'rN39Y3HR', // Rear Wheel Right
          '2RFF3Uf8', // Rear Door Right
          'B5s1CWT-', // Rocker Panel Right
          'enHQTFae', // Front Door Right
          'PuIw17h0', // Front Wheel Right
          'CELBsvYD', // Front Bumper Side Right
        ]}
      />
      <ValidationDialog
        requests={requests}
        screen={screen}
        inspectionId={inspectionId}
      />
    </>
  );
};
