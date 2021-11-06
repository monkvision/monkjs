import React, { useCallback } from 'react';

import { CameraView } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { TUTORIAL } from 'screens/names';

export default () => {
  const navigation = useNavigation();

  // eslint-disable-next-line no-console
  const handleSuccess = (payload) => console.log(payload);

  const handleClose = useCallback(() => {
    navigation.navigate(TUTORIAL);
  }, [navigation]);

  return <CameraView onSuccess={handleSuccess} onCloseCamera={handleClose} />;
};
