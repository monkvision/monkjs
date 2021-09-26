import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function BackAction() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const handlePress = () => navigation.goBack();

  return <Appbar.BackAction onPress={handlePress} color={colors.primaryContrastText} />;
}
