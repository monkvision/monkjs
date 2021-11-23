import React, { useCallback } from 'react';
import { DAMAGE_LIBRARY } from 'screens/names';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from 'react-native-paper';

// JSON pretty component
// Use redux toolkit selector with corejs
// https://redux-toolkit.js.org/rtk-query/api/created-api/redux-integration

export default () => {
  const navigation = useNavigation();
  const route = useRoute();
  const inspectionId = route.params.inspectionId;
  const goToLibrary = useCallback(() => {
    navigation.navigate(DAMAGE_LIBRARY, { inspectionId });
  }, [inspectionId, navigation]);

  return (
    <>
      <Button onPress={goToLibrary} mode="contained">
        Go to damage library
      </Button>
    </>
  );
};
