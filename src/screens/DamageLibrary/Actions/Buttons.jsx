import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, useTheme, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

const styles = StyleSheet.create({
  closeBtnText: {
    alignSelf: 'center',
    fontSize: 17,
  },
  closeIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 10,
    marginBottom: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const ValidateButton = ({ onPress, text }) => {
  const { colors } = useTheme();

  return (
    <Button
      mode="contained"
      uppercase={false}
      onPress={onPress}
      color={colors.success}
    >
      {text}
    </Button>
  );
};

export const CloseButton = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.closeIcon}>
        <MaterialCommunityIcons name="close" size={24} color={colors.danger} />
      </View>
      <Text style={{ color: colors.primary }}>Close</Text>
    </TouchableOpacity>
  );
};

ValidateButton.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
};

ValidateButton.defaultProps = {
  onPress: noop,
  text: 'Validate',
};

CloseButton.propTypes = {
  onPress: PropTypes.func,
};

CloseButton.defaultProps = {
  onPress: noop,
};
