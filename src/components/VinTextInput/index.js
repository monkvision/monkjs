/* eslint-disable react/forbid-prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import { TextInputMask } from 'react-native-masked-text';
import { HelperText, TextInput } from 'react-native-paper';
import styles from 'screens/InspectionCreate/styles';

export default function VinTextInput(props) {
  const {
    viewProps,
    form,
    textInputIconProps,
    textInputProps,
    helperTextProps,
    helperText,
  } = props;

  return (
    <View {...viewProps}>
      <TextInput
        label="VIN number"
        placeholder="VFX XXXXX XXXXXXXX"
        onChangeText={form.handleChange('vin')}
        render={(renderProps) => (
          <TextInputMask
            type="custom"
            options={{ mask: 'SSS SSSSSS SSSSSSSS' }}
            {...renderProps}
          />
        )}
        right={(
          <TextInput.Icon
            forceTextInputFocus={false}
            name="camera"
            {...textInputIconProps}
          />
        )}
        style={styles.textInput}
        value={form.values.vin}
        {...textInputProps}
      />
      <HelperText visible style={styles.helperText} {...helperTextProps}>
        {helperText}
        The best way to see it is to look
        through the windshield from outside the car
        or on the passenger&#39;s side door pillar.
      </HelperText>
    </View>
  );
}

VinTextInput.propTypes = {
  form: PropTypes.object,
  helperText: PropTypes.string,
  helperTextProps: PropTypes.object,
  textInputIconProps: PropTypes.object,
  textInputProps: PropTypes.object,
  viewProps: PropTypes.object,
};

VinTextInput.defaultProps = {
  viewProps: {},
  form: {},
  textInputIconProps: {},
  textInputProps: {},
  helperTextProps: {},
  helperText: `
    The best way to see it is to look
    through the windshield from outside the car
    or on the passenger&#39;s side door pillar.
  `,
};
