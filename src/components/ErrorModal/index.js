import PropTypes from 'prop-types';
import React from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import styles from './styles';

export default function ErrorModal({ texts, onPress }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container]}>
      <View style={[styles.errorPopup, { width: width - 60 }]}>
        <Text style={[styles.errorMessage]}>{texts.message}</Text>
        <View style={[styles.errorButtonsContainer]}>
          <TouchableOpacity
            style={[styles.errorButton, { backgroundColor: colors.surface }]}
            onPress={onPress}
          >
            <Text style={[styles.errorButtonText]}>{texts.label}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

ErrorModal.propTypes = {
  onPress: PropTypes.func,
  texts: PropTypes.shape({
    label: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

ErrorModal.defaultProps = {
  onPress: () => {},
};
