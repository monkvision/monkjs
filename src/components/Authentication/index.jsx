import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Drawing from 'components/Drawing';
import MonkIcon from 'components/Icons/MonkIcon';
import LoginButton from 'components/Authentication/LoginButton';

import svgXml from './undraw_mobile_photos_psm5.svg';
import styles from './styles';

export default function Authentication() {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <MonkIcon color={colors.primary} width={250} height={64} />
      <LoginButton />
      <Drawing xml={svgXml} alt="artwork" width={304} height={221} />
    </View>
  );
}
