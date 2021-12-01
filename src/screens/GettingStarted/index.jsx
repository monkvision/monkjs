import React, { useCallback, useLayoutEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { TutorialView } from '@monkvision/react-native-views';
import { Button, useTheme } from 'react-native-paper';

import { INSPECTION_CREATE } from 'screens/names';

export default function GettingStarted() {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleStart = useCallback(() => {
    navigation.navigate(INSPECTION_CREATE);
  }, [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Photo process',
        headerBackVisible: true,
        headerRight: () => <Button icon="camera" onPress={handleStart}>Start</Button>,
      });
    }
  }, [handleStart, navigation]);

  return (
    <TutorialView navigation={navigation} onStart={handleStart} theme={theme} />
  );
}
