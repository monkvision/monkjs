import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#5D5E67',
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
  },
});

function TextButton({ label, onPress }) {
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <Text style={[styles.text]}>{label}</Text>
    </TouchableOpacity>
  );
}

TextButton.propTypes = {
  label: PropTypes.string,
  onPress: PropTypes.func,
};
TextButton.defaultProps = {
  label: '',
  onPress: () => {},
};

export default TextButton;
