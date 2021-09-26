import React, { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTheme, Button } from 'react-native-paper';

export default function InspectionsRightActions() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handlePress = useCallback(() => {
    navigation.navigate('InspectionsCreate');
  }, [navigation]);

  return (
    <Button onPress={handlePress} color={colors.primaryContrastText}>Start</Button>
  );
}
