import React, { useCallback } from 'react';

import { CameraView } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { GET_START, INSPECTION_REVIEW } from 'screens/names';

export default () => {
  const navigation = useNavigation();

  const handleSuccess = useCallback((payload) => {
    // eslint-disable-next-line no-console
    console.log(payload);
    navigation.navigate(INSPECTION_REVIEW);

    // Use API to get predictions
  }, [navigation]);

  const handleClose = useCallback(() => {
    navigation.navigate(GET_START);
  }, [navigation]);

  return <CameraView onSuccess={handleSuccess} onCloseCamera={handleClose} />;
};
