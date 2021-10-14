import React from 'react';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { ProgressBar, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles } from './styles';

export default function Header({ onCancel, progression }) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <View style={{ flex: 0.1 }}>
        <MaterialCommunityIcons name="close" size={24} onPress={onCancel} />
      </View>
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

Header.defaultProps = { onCancel: noop, progression: 0 };
