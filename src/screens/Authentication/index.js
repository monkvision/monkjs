import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, useTheme } from 'react-native-paper';

import Drawing from 'components/Drawing';
import MonkIcon from 'components/Icons/MonkIcon';

import SignIn from './SignIn';
import styles from './styles';
import svgXml from './undraw_visualization_c-2-ps.svg';

export default function Authentication() {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      <MonkIcon color={colors.primary} width={250} height={64} />
      <Text style={styles.text}>AI powered vehicle damage detection</Text>
      <SignIn />
      <Drawing xml={svgXml} alt="artwork" width={228} height={193} />
    </View>
  );
}
