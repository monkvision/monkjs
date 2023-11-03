import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const styles = StyleSheet.create({
  textLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    color: '#fff',
    padding: 10,
  },
});

function FreeTextInput({ label, value, inputProps, onChange }) {
  return (
    <View>
      <Text style={styles.textLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={onChange}
        value={value}
        {...inputProps}
      />
    </View>
  );
}

FreeTextInput.propTypes = {
  inputProps: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

FreeTextInput.defaultProps = {
  inputProps: {},
  label: '',
  onChange: () => { },
  value: '',
};

export default FreeTextInput;
