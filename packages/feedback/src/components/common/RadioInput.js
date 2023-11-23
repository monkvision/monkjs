import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  textLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  radioButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10,
  },
  radioButton: {
    alignItems: 'center',
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  radioButtonIcon: {
    backgroundColor: '#fff',
    borderRadius: 7,
    height: 12,
    width: 12,
  },
  radioButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

function RadioInput({ label, options, value, onChange }) {
  return (
    <>
      <Text style={styles.textLabel}>{label}</Text>
      <View style={options.length > 3 ? { flexDirection: 'column' } : { flexDirection: 'row' }}>
        {
          options.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <View style={styles.radioButtonContainer} key={`${item.label}-${index}`}>
              <TouchableOpacity onPress={() => onChange(item)} style={styles.radioButton}>
                {value === item.value ? <View style={styles.radioButtonIcon} /> : null}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onChange(item)}>
                <Text style={styles.radioButtonText}>{item.label}</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    </>
  );
}

RadioInput.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  value: PropTypes.any,
};

RadioInput.defaultProps = {
  label: '',
  value: '',
  options: [],
  onChange: () => { },
};

export default RadioInput;
