import React, { useCallback } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Appbar, useTheme } from 'react-native-paper';

export default function InspectionsRightActions() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handlePress = useCallback(() => {
    navigation.navigate('InspectionsCreate');
  }, [navigation]);

  return (
    <Appbar.Action
      onPress={handlePress}
      color={colors.primaryContrastText}
      icon={(props) => <MaterialCommunityIcons name="plus" {...props} />}
    />
  );
}
