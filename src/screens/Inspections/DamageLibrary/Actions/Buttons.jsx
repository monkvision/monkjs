import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, useTheme, Text } from 'react-native-paper';
import { Octicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

const styles = StyleSheet.create({
  validateButton: {
    justifyContent: 'center',
    height: 60,
    width: 178,
    backgroundColor: '#5CCC68',
  },
  validateButtonText: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 18,
    lineHeight: 40,
  },
  guideBtnText: {
    color: '#274B9F',
    alignSelf: 'center',
    fontSize: 17,
  },
  guideIcon: {
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
  const theme = useTheme();
  return (
    <Button mode="contained" uppercase={false} style={styles.validateButton} onPress={onPress} color={theme.colors.primary}>
      <Text style={styles.validateButtonText}>{text}</Text>
    </Button>
  );
};


export const GuideButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.guideIcon}>
      <Octicons name="light-bulb" size={24} color="#274B9F" />
    </View>
    <Text style={styles.guideBtnText}>Guide</Text>
  </TouchableOpacity>
);

ValidateButton.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
};

ValidateButton.defaultProps = {
  onPress: noop,
  text: 'Validate',
};

GuideButton.propTypes = {
  onPress: PropTypes.func,
};

GuideButton.defaultProps = {
  onPress: noop,
};
