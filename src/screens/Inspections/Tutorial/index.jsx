import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import CameraView from '@monkvision/react-native-views/src/components/VehicleTourTutorial';

export default function InspectionsCreate() {
  const navigation = useNavigation();

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const handleStart = useCallback(() => {
    navigation.navigate('InspectionsCreate');
  }, [navigation]);

  return (
    <CameraView onCancel={handleCancel} onStart={handleStart} progression={0.1} />
  );
}
