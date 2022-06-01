import React, { useMemo } from 'react';
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

export default function Button({ colors, children, color, ...props }) {
  const composedStyles = useMemo(() => {
    const disabledColor = color.disabled || colors.disabled;
    const backgroundColor = color.background || colors.background;
    return {
      backgroundColor: props.disabled ? disabledColor : backgroundColor,
      opacity: props.disabled ? 0.8 : 1,
    };
  }, [color, colors, props.disabled]);

  return (
    <TouchableOpacity
      style={[styles.button, composedStyles]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}
Button.propTypes = {
  children: PropTypes.element.isRequired,
  color: PropTypes.objectOf(PropTypes.string).isRequired,
  colors: PropTypes.shape({
    background: PropTypes.string,
    disabled: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};
Button.defaultProps = {
  disabled: true,
};
