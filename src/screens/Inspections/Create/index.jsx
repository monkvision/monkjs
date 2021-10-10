import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import useMasks from '@monkvision/react-native/src/hooks/useMasks';

import CameraView from '@monkvision/react-native-views/src/components/CameraView';
import sights from '@monkvision/corejs/src/sights/abstract.json';

export default function InspectionsCreate() {
  const navigation = useNavigation();
  const sightMasks = useMasks(sights);

  const handleCloseCamera = useCallback((/* pictures */) => {
    // console.log(pictures);
    navigation.navigate('InspectionsHome');
  }, [navigation]);

  return (
    <CameraView
      onCloseCamera={handleCloseCamera}
      sightMasks={sightMasks}
      sights={sights}
    />
  );
}
