import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import CameraView from '@monkvision/react-native-views/src/components/CameraView';
import PicturesSummary from '@monkvision/react-native-views/src/components/PicturesSummary';

export default function InspectionsCreate() {
  const navigation = useNavigation();
  const [cameraViewPictures, setPictures] = useState({});
  const [cameraViewSights, setSights] = useState([]);
  const [end, setEnd] = useState(false);

  const handleCloseCamera = useCallback(() => {
    navigation.navigate('InspectionsHome');
  }, [navigation]);

  const handleTourEnd = useCallback((pictures, camera, sights) => {
    setPictures(pictures);
    setSights(sights);
    setEnd(true);
  }, []);

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
