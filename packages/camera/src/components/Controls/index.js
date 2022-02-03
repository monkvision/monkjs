import React from 'react';
import PropTypes from 'prop-types';

import {
  Platform, Pressable, StyleSheet,
  useWindowDimensions, View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    fontSize: 34,
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
  hidden: {
    visibility: 'hidden',
    opacity: 0,
  },
});

export function ControlButton({ children, disabled, hidden, style, ...passThroughProps }) {
  return (
    <Pressable
      disabled={disabled || hidden}
      style={[styles.button, style, hidden ? styles.hidden : {}]}
      {...passThroughProps}
    >
      {children}
    </Pressable>
  );
}

ControlButton.propTypes = {
  children: PropTypes.element,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
};

ControlButton.defaultProps = {
  children: null,
  disabled: false,
  hidden: false,
};

function Controls({
  buttonCaptureProps,
  buttonSettingsProps,
  buttonValidateProps,
  containerStyle,
  onSettings,
  onCapture,
  onValidate,
  ...passThroughProps
}) {
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
        acccessibilityLabel="Settings button"
        onPress={onSettings}
        style={styles.button}
        {...buttonSettingsProps}
        {...passThroughProps}
      />
      <ControlButton
        acccessibilityLabel="Capture button"
        onPress={onCapture}
        style={styles.captureButton}
        {...buttonCaptureProps}
        {...passThroughProps}
      >
        <View style={styles.button} />
      </ControlButton>
      <ControlButton
        acccessibilityLabel="Validate button"
        onPress={onValidate}
        style={styles.button}
        {...buttonValidateProps}
        {...passThroughProps}
      />
    </View>
  );
}

Controls.propTypes = {
  buttonCaptureProps: PropTypes.objectOf(PropTypes.any),
  buttonSettingsProps: PropTypes.objectOf(PropTypes.any),
  buttonValidateProps: PropTypes.objectOf(PropTypes.any),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onCapture: PropTypes.func,
  onSettings: PropTypes.func,
  onValidate: PropTypes.func,
};

Controls.defaultProps = {
  buttonCaptureProps: {},
  buttonSettingsProps: { hidden: true },
  buttonValidateProps: { hidden: true },
  containerStyle: null,
  onCapture: () => {},
  onSettings: () => {},
  onValidate: () => {},
};

export default Controls;
