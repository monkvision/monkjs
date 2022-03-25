/* eslint-disable react/no-array-index-key */
import React, { createElement, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import useHandlers from './hooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    maxWidth: '100%',
    borderRadius: 150,
    width: 68,
    height: 68,
    backgroundColor: '#fff',
  },
});

export default function Controls({
  api,
  containerStyle,
  elements,
  loading,
  state,
  enableComplianceCheck,
  onStartUploadPicture,
  onFinishUploadPicture,
  ...passThroughProps
}) {
  const { height: windowHeight } = useWindowDimensions();

  const handlers = useHandlers({
    onStartUploadPicture,
    onFinishUploadPicture,
    enableComplianceCheck,
  });

  const handlePress = useCallback(({ onPress }) => (e) => {
    if (typeof onPress === 'function') { onPress(state, api, e); } else { handlers.capture(state, api, e); }
  }, [api, handlers, state]);

  return (
    <View
      acccessibilityLabel="Controls"
      style={[styles.container, containerStyle, Platform.select({
        native: { maxHeight: '100vh' },
        default: { maxHeight: windowHeight },
      })]}
    >
      {elements.map(({
        children,
        component = TouchableOpacity,
        onPress,
        ...rest
      }, i) => (
        createElement(component, {
          key: `camera-control-${i}`,
          disabled: loading,
          onPress: handlePress({ onPress, ...rest }),
          style: StyleSheet.flatten([styles.button]),
          ...rest,
          ...passThroughProps,
        }, children)
      ))}
    </View>
  );
}

Controls.propTypes = {
  api: PropTypes.shape({
    camera: PropTypes.shape({ takePictureAsync: PropTypes.func }),
    goNextSight: PropTypes.func,
    goPrevSight: PropTypes.func,
    startUploadAsync: PropTypes.func,
    takePictureSync: PropTypes.func,
  }),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  elements: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  })),
  enableComplianceCheck: PropTypes.bool,
  onFinishUploadPicture: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  loading: PropTypes.bool,
  state: PropTypes.shape({
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
};

Controls.defaultProps = {
  api: {},
  containerStyle: null,
  elements: [],
  enableComplianceCheck: false,
  loading: false,
  state: {},
  onStartUploadPicture: () => {},
  onFinishUploadPicture: () => {},
};

Controls.CaptureButtonProps = {
  accessibilityLabel: 'Take picture',
  children: (
    <Text style={{
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      height: '100%',
      fontSize: 10,
      textTransform: 'uppercase',
    }}
    >
      Take picture
    </Text>
  ),
  style: {
    maxWidth: '100%',
    backgroundColor: '#fff',
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 84,
    borderColor: 'white',
    borderWidth: 4,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({
      native: { shadowRadius: 4 },
      default: { shadowRadius: '4px 4px' },
    }),
  },
};
