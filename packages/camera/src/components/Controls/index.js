import React from 'react';
import PropTypes from 'prop-types';

import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
    borderRadius: 68,
    backgroundColor: 'white',
  },
  captureButton: {
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 84,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 4,
    overflow: 'hidden',
  },
});

export function ControlButton({ children, disabled, style, ...passThroughProps }) {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.button, style]}
      {...passThroughProps}
    >
      {children}
    </Pressable>
  );
}

ControlButton.propTypes = {
  children: PropTypes.element,
  disabled: PropTypes.bool,
};

ControlButton.defaultProps = {
  children: null,
  disabled: false,
};

function Controls({ containerStyle, onCapture, ...passThroughProps }) {
  const { height: windowHeight } = useWindowDimensions();

  return (
    <View
      acccessibilityLabel="Controls"
      style={[styles.container, containerStyle, Platform.select({
        native: { maxHeight: '100vh' },
        default: { maxHeight: windowHeight },
      })]}
    >
      <ControlButton
        acccessibilityLabel="Capture button"
        onPress={onCapture}
        style={styles.captureButton}
        {...passThroughProps}
      >
        <View style={styles.button} />
      </ControlButton>
    </View>
  );
}

Controls.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onCapture: PropTypes.func,
};

Controls.defaultProps = {
  containerStyle: null,
  onCapture: () => {},
};

export default Controls;
