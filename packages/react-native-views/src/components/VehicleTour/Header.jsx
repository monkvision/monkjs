import { Entypo } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { Text, View } from 'react-native';
import { ProgressBar, useTheme } from 'react-native-paper';

import style from './style';

export default function Header({ onCancel, progression }) {
  const { colors } = useTheme();
  return (
    <View style={style.header}>
      <Entypo name="cross" size={24} style={{ flex: 0.1 }} onPress={onCancel} />
      <View style={{ flex: 0.85 }}>
        <Text>{`${progression * 100}%`}</Text>
        <ProgressBar progress={progression} color={colors.primary} />
      </View>
    </View>
  );
}
Header.propTypes = {
  onCancel: PropTypes.func,
  progression: PropTypes.number,
};
Header.defaultProps = { onCancel: () => null, progression: 0 };
