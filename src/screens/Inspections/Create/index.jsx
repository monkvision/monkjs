/* eslint-disable no-alert, no-console */
import React, { useCallback, useState } from 'react';

import CameraView from '@monkvision/react-native-views/src/components/CameraView';
import PicturesSummaryView from '@monkvision/react-native-views/src/components/PicturesSummaryView';

export default function InspectionsCreate() {
  const [cameraViewPictures, setPictures] = useState({});
  const [cameraViewSights, setSights] = useState([]);
  const [end, setEnd] = useState(false);

  const handleCloseCamera = useCallback((pictures) => {
    console.log(pictures);
  }, []);

  const handleTourEnd = useCallback((pictures, camera, sights) => {
    setPictures(pictures);
    setSights(sights);
    setEnd(true);
    handleCloseCamera(pictures);
  }, [handleCloseCamera]);

  return end === false ? (
    <CameraView
      onCloseCamera={handleCloseCamera}
      onTourEnd={handleTourEnd}
      sights={[
        ['abstractFront', [null, 0, null], 'front'],
        ['abstractFrontRight', [null, 330, null], 'front right'],
        ['abstractFrontLateralRight', [null, 300, null], 'front side right'],
        ['abstractMiddleLateralRight', [null, 270, null], 'middle side right'],
        ['abstractRearLateralRight', [null, 240, null], 'rear side right'],
        ['abstractRearRight', [null, 210, null], 'rear right'],
        ['abstractRear', [null, 180, null], 'rear'],
        ['abstractRearLeft', [null, 150, null], 'rear left'],
        ['abstractRearLateralLeft', [null, 120, null], 'read side left'],
        ['abstractMiddleLateralLeft', [null, 90, null], 'middle side left'],
        ['abstractFrontLateralLeft', [null, 60, null], 'front side left'],
        ['abstractFrontLeft', [null, 30, null], 'front left'],
        ['abstractInteriorFront', [null, null, null], 'interior front'],
        ['abstractBoard', [null, null, null], 'board'],
        ['abstractInteriorBack', [null, null, null], 'interior back'],
        ['abstractTrunk', [null, null, null], 'trunk'],
      ]}
    />
  ) : (
    <PicturesSummaryView
      cameraViewPictures={cameraViewPictures}
      onTourEnd={() => alert('end')}
      sights={cameraViewSights}
    />
  );
}
