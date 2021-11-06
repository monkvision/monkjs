import React, { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';
import { TutorialView } from '@monkvision/react-native-views';

import { INSPECTION_CREATE } from 'screens/names';

export default function Tutorial() {
  const navigation = useNavigation();

  const handleStart = useCallback(() => {
    navigation.navigate(INSPECTION_CREATE);
  }, [navigation]);

  return (
    <TutorialView navigation={navigation} onStart={handleStart} />
  );
}
