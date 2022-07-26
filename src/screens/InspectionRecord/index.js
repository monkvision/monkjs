import React, { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { Alert } from 'react-native';

import { CameraRecord } from '@monkvision/camera';

import { useError } from '@monkvision/toolkit';

import * as names from 'screens/names';

import Sentry from '../../config/sentry';

export default function InspectionRecord() {
  const route = useRoute();
  const navigation = useNavigation();
  const { errorHandler, Constants } = useError(Sentry);
  const { colors } = useTheme();

  const { inspectionId } = route.params;

  const handleNavigate = useCallback((confirm = false) => {
    if (confirm) {
      Alert.alert(
        'Are you sure you want to quit?',
        'Your taken pictures will be lost for that task.',
        [{
          text: 'Cancel',
          style: 'cancel',
        }, {
          text: 'OK',
          onPress: () => {
            errorHandler(new Error('User suddenly quit the record'), Constants.type.APP);
            navigation.navigate(names.LANDING, { inspectionId });
          },
        }],
        { cancelable: true },
      );
    } else { navigation.navigate(names.LANDING, { inspectionId }); }
  }, [inspectionId, navigation]);

  return (
    <CameraRecord
      colors={colors}
      onQuit={handleNavigate}
      onValidate={handleNavigate}
      inspectionId={inspectionId}
    />
  );
}
