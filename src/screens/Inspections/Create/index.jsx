/* eslint-disable no-alert, no-console */
import React, { useCallback, useState } from 'react';

import CameraView from '@monkvision/react-native-views/src/components/CameraView';
import PicturesSummary from '@monkvision/react-native-views/src/components/PicturesSummary';

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
    />
  ) : (
    <PicturesSummary
      cameraViewPictures={cameraViewPictures}
      onTourEnd={() => alert('end')}
      sights={cameraViewSights}
    />
  );
}
