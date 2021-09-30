import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import CameraView from '@monkvision/react-native-views/src/components/CameraView';

export default function InspectionsCreate() {
  const navigation = useNavigation();

  const handleCloseCamera = useCallback((/* pictures */) => {
    // console.log(pictures);
    navigation.navigate('InspectionsHome');
  }, [navigation]);

  return (
    <CameraView onCloseCamera={handleCloseCamera} />
  );
}
