import React from 'react';
import PropTypes from 'prop-types';

import { Dimensions, Platform, Text, View } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import usePermissions from '../../hooks/usePermissions';

function getSize(ratio) {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  const [a, b] = ratio.split(':').sort((c, d) => (c + d));
  const longest = windowHeight <= windowWidth ? windowHeight : windowWidth;

  return {
    ...Platform.select({
      native: {
        height: longest,
        width: longest * (a / b),
      },
      default: {
        height: '100vh',
        width: `${Math.floor(100 * (a / b))}vh`,
      },
    }),
  };
}

export default function Camera({
  children,
  containerStyle,
  onRef,
  ratio,
  style,
  ...passThroughProps
}) {
  const permissions = usePermissions();

  if (permissions.isGranted === null) {
    return <View />;
  }

  if (permissions.isGranted === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      accessibilityLabel="Camera container"
      style={[getSize(ratio), containerStyle]}
    >
      <ExpoCamera
        ref={onRef}
        ratio={ratio}
        type={ExpoCamera.Constants.Type.back}
        {...passThroughProps}
      >
        {children}
      </ExpoCamera>
    </View>
  );
}

Camera.propTypes = {
  children: PropTypes.element,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onRef: PropTypes.func.isRequired,
  ratio: PropTypes.string.isRequired,
};

Camera.defaultProps = {
  children: null,
  containerStyle: null,
};
