import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const styles = StyleSheet.create({
  textLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  containerStyle: {
    backgroundColor: '#121212',
  },
  dropdown: {
    borderColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    height: 39,
    padding: 12,
  },
  placeholderStyle: {
    color: '#fff',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#fff',
  },
  iconStyle: {
    height: 20,
    width: 20,
  },
  itemTextStyle: {
    color: '#fff',
  },
  inputSearchStyle: {
    color: '#fff',
    fontSize: 16,
    outlineWidth: 0,
  },
  icon: {
    marginRight: 5,
  },
});

function SelectInput({ label, options, value, onChange, config, inputProps }) {
  return (
    <>
      <Text style={styles.textLabel}>{label}</Text>
      {
        config.isMulti ? (
          <MultiSelect
            {...inputProps}
            activeColor="#282828cc"
            containerStyle={styles.containerStyle}
            data={options}
            iconStyle={styles.iconStyle}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle={styles.itemTextStyle}
            labelField="label"
            maxHeight={300}
            mode="auto"
            onChange={(item) => onChange(item)}
            placeholderStyle={styles.placeholderStyle}
            search
            selectedTextStyle={styles.selectedTextStyle}
            style={styles.dropdown}
            value={value}
            valueField="value"
          />
        ) : (
          <Dropdown
            {...inputProps}
            activeColor="#282828cc"
            containerStyle={styles.containerStyle}
            data={options}
            iconStyle={styles.iconStyle}
            inputSearchStyle={styles.inputSearchStyle}
            itemTextStyle={styles.itemTextStyle}
            labelField="label"
            maxHeight={300}
            mode="auto"
            onChange={(item) => onChange(item)}
            placeholderStyle={styles.placeholderStyle}
            search
            selectedTextStyle={styles.selectedTextStyle}
            style={styles.dropdown}
            value={value}
            valueField="value"
          />
        )
      }
    </>
  );
}

SelectInput.propTypes = {
  config: PropTypes.shape({
    isMulti: PropTypes.bool,
  }),
  inputProps: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  value: PropTypes.any,
};

SelectInput.defaultProps = {
  label: '',
  value: '',
  options: [],
  onChange: () => { },
  config: {
    isMulti: false,
  },
  inputProps: {},
};

export default SelectInput;
