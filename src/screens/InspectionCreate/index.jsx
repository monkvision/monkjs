import React, { useCallback } from 'react';

import { CameraView } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { TUTORIAL } from 'screens/names';

export default () => {
  const navigation = useNavigation();

  // eslint-disable-next-line no-console
  const handleSuccess = (payload) => console.log(payload);
  // Use API to get predictions
  // Show result in a JSON pretty component
  // Read navigation docs to pass result as params

  // const handleSuccess = useCallback(() => {
  //   navigation.navigate(INSPECTION_READ);
  // }, [navigation]);

  const handleClose = useCallback(() => {
    navigation.navigate(TUTORIAL);
  }, [navigation]);

  return <CameraView onSuccess={handleSuccess} onCloseCamera={handleClose} />;
};
