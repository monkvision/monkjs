import React from 'react';
import PropTypes from 'prop-types';
import { Button, useTheme } from 'react-native-paper';
import { useMediaQuery } from 'react-responsive';
import styles from '../styles';

export default function ValidationButton({ onPress, isValidated }) {
  const { colors } = useTheme();
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1224px)' });

  return (
    <Button
      color={colors.success}
      labelStyle={styles.buttonLabel}
      onPress={onPress}
      mode="contained"
      icon="send"
      disabled={isValidated}
      style={[
        styles.validationButton,
        isDesktopOrLaptop ? { maxWidth: 180, alignSelf: 'flex-end' } : {},
      ]}
    >
      Validate
    </Button>
  );
}

ValidationButton.propTypes = {
  isValidated: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};
