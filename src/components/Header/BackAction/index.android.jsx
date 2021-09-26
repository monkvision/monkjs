import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BackAction() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const handlePress = () => navigation.goBack();

  return (
    <Appbar.Action
      accessibilityLabel="Go back"
      onPress={handlePress}
      color={colors.primaryContrastText}
      icon={(props) => <MaterialCommunityIcons name="arrow-left" {...props} />}
    />
  );
}
