import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  button: {
    marginVertical: spacing(1.4),
    marginRight: 10,
    borderRadius: 4,
    padding: spacing(1.4),
  },
});

export default function Button({ colors, children, ...props }) {
  return (
    <TouchableOpacity
      style={[styles.button,
        { backgroundColor: props.disabled ? colors.actions.disabled : props.color }]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}
Button.propTypes = {
  children: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  colors: PropTypes.shape({
    actions: PropTypes.shape({
      disabled: PropTypes.string,
      primary: PropTypes.string,
      secondary: PropTypes.string,
    }),
    background: PropTypes.string,
    error: PropTypes.string,
    loader: PropTypes.string,
    neutral: PropTypes.string,
    subtitle: PropTypes.string,
    text: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};
Button.defaultProps = {
  disabled: true,
};
