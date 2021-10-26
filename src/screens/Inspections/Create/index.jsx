/* eslint-disable no-alert, no-console */
import React, { useCallback, useState } from 'react';

import CameraView from '@monkvision/react-native-views/src/components/CameraView';
import PicturesSummaryView from '@monkvision/react-native-views/src/components/PicturesSummaryView';
import { sights } from '@monkvision/corejs';

export default function InspectionsCreate() {
  const [cameraViewPictures, setPictures] = useState({});
  const [cameraViewSights, setSights] = useState([]);
  const [end, setEnd] = useState(false);

  const handleCloseCamera = useCallback((pictures) => {
    console.log(pictures);
  }, []);

  const handleTourEnd = useCallback((pictures, camera, newSights) => {
    setPictures(pictures);
    setSights(newSights);
    setEnd(true);
    handleCloseCamera(pictures);
  }, [handleCloseCamera]);

  return end === false ? (
    <CameraView
      onCloseCamera={handleCloseCamera}
      onTourEnd={handleTourEnd}
      sights={sights.combos.withInterior}
    />
  ) : (
    <PicturesSummaryView
      cameraViewPictures={cameraViewPictures}
      onTourEnd={() => alert('end')}
      sights={cameraViewSights}
    />
  );
}
