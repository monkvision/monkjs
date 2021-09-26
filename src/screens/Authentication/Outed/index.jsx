import React from 'react';
import { View } from 'react-native';
import { Text, Title, useTheme } from 'react-native-paper';

import Drawing from 'components/Drawing';

import SignIn from '../SignIn';
import svgXml from './undraw_a_day_off_w9ex.svg';
import styles from '../styles';

export default function Outed() {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Title>You are signed out</Title>
      <Text>See you next time!</Text>
      <SignIn />
      <Drawing xml={svgXml} alt="artwork" width={304} height={221} />
    </View>
  );
}
